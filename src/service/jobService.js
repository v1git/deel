import { Op } from 'sequelize';
import BadRequestException from '../exception/badRequestException.js';
import NotFoundException from '../exception/notFoundException.js';
import ForbiddenException from '../exception/forbiddenException.js';
// eslint-disable-next-line no-unused-vars
import { sequelize, Profile, Job } from '../model.js';

export default class JobService {
  /**
   * Constructor.
   */
  constructor() {
    this.model = sequelize.models.Job;
  }

  /**
   * Returns all unpaid jobs (with active contract) for a user.
   *
   * @param {Profile} profile  The user's auth.
   *
   * @returns {Promise<Job[]>} The collection of unpaid jobs.
   */
  getUnpaidByProfile(profile) {
    return this.model.findAll({
      include: {
        model: sequelize.models.Contract,
        as: 'Contract',
        required: true,
      },
      where: {
        [Op.and]: [
          { paid: { [Op.is]: null } },
          { '$Contract.status$': { [Op.ne]: 'terminated' } },
          {
            [Op.or]: [
              { '$Contract.ClientId$': { [Op.eq]: profile.id } },
              { '$Contract.ContractorId$': { [Op.eq]: profile.id } },
            ],
          },
        ],
      },
    });
  }

  /**
   * Performs payment for a job (and changes the client and the contractor balances).
   *
   * @param {string} id The identifier of the job.
   * @param {Profile} profile The profile who performs payment.
   *
   * @returns {Promise<Job>} Updated job.
   * @throws {NotFoundException|ForbiddenException|BadRequestException}
   */
  async pay(id, profile) {
    const result = await sequelize.transaction(async (t) => {
      const job = await this.model.findOne({
        include: {
          model: sequelize.models.Contract,
          as: 'Contract',
          required: true,
        },
        where: { id },
        transaction: t,
      });

      if (!job) {
        throw new NotFoundException();
      }

      if (job && job.Contract.ClientId !== profile.id) {
        throw new ForbiddenException();
      }

      if (job.price > profile.balance) {
        throw new BadRequestException('There are not enough funds on your account');
      }

      job.set({ paid: true });
      await job.save({ transaction: t });

      await sequelize.models.Profile.decrement(
        { balance: job.price },
        { where: { id: job.Contract.ClientId }, transaction: t },
      );
      await sequelize.models.Profile.increment(
        { balance: job.price },
        { where: { id: job.Contract.ContractorId }, transaction: t },
      );

      return job;
    });

    return result;
  }

  /**
   * Return the user's debt.
   *
   * @param {Profile} profile The user.
   * @returns {Promise<number>} The amount of debt.
   */
  getDebtByProfile(profile) {
    return this.model.sum('price', {
      include: {
        model: sequelize.models.Contract,
        as: 'Contract',
        required: true,
      },
      where: {
        [Op.and]: [
          { paid: { [Op.is]: null } },
          { '$Contract.status$': { [Op.ne]: 'terminated' } },
          { '$Contract.ClientId$': { [Op.eq]: profile.id } },
        ],
      },
    });
  }
}
