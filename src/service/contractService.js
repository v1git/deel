import { Op } from 'sequelize';
// eslint-disable-next-line no-unused-vars
import { Contract, Profile, sequelize } from '../model.js';
import NotFoundException from '../exception/notFoundException.js';
import ForbiddenException from '../exception/forbiddenException.js';

export default class ContractService {
  /**
   * Constructor.
   */
  constructor() {
    this.model = sequelize.models.Contract;
  }

  /**
   * Return the user's (client or contractor) contract.
   *
   * @param {string} id The contract's identifier.
   * @param {Profile} profile The current auth.
   *
   * @returns {Promise<Contract>} Resolved promise with user's contract.
   */
  async getOne(id, profile) {
    const contract = await this.model.findOne({ where: { id } });

    if (!contract) {
      throw new NotFoundException();
    }

    if (contract && ![contract.ClientId, contract.ContractorId].includes(profile.id)) {
      throw new ForbiddenException();
    }

    return contract;
  }

  /**
   * Return the user's (client or contractor) contract.
   *
   * @param {Profile} profile The current auth.
   *
   * @returns {Promise<Contract>} Resolved promise with the collection of the user contract.
   */
  getActiveByProfile(profile) {
    return this.model.findAll({
      where: {
        [Op.and]: [
          { status: { [Op.ne]: 'terminated' } },
          {
            [Op.or]: [
              { ClientId: { [Op.eq]: profile.id } },
              { ContractorId: { [Op.eq]: profile.id } },
            ],
          },
        ],
      },
    });
  }
}
