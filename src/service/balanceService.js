/* eslint-disable no-unused-vars */
import { Op } from 'sequelize';
import BadRequestException from '../exception/badRequestException.js';
import { sequelize } from '../model.js';
import JobService from './jobService.js';

export default class BalanceService {
  /**
   * Constructor
   *
   * @param {JobService} jobService The instance of the job service.
   */
  constructor(jobService) {
    this.model = sequelize.models.Profile;
    this.jobService = jobService;
  }

  /**
   * Deposits money into the the the balance of a client.
   * A client can't deposit more than 25% his total of jobs to pay
   *
   * @param {*} profileId The client profile id.
   * @param {*} amount The amount of deposit.
   * @returns {Promise<{profileId: string, balance: number}>}
   */
  async deposit(profileId, amount) {
    const profile = await this.model.findOne({
      where: {
        [Op.and]: [{ id: profileId }, { type: 'client' }],
      },
    });

    const debt = await this.jobService.getDebtByProfile(profile);

    if (amount > debt * 0.25) {
      throw new BadRequestException('The deposit should be less than 25% of your debt.');
    }

    profile.balance += amount;
    await profile.save();

    return { profileId: profile.id, balance: profile.balance };
  }
}
