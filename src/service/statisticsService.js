/* eslint-disable class-methods-use-this */
import { QueryTypes } from 'sequelize';
import moment from 'moment';
import { sequelize } from '../model.js';
import BadRequestException from '../exception/badRequestException.js';

export default class StatisticsService {
  /**
   * Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
   *
   * @param {string} start The start date.
   * @param {string} end The end date.
   *
   * @returns {Promise} The best profession.
   */
  async getBestProfession(start, end) {
    this.validateDates(start, end);

    /**
     * @todo: Rewrite it without native query (if it possible).
     */
    return (
      await sequelize.query(
        'SELECT `id`, `profession`, MAX(`earned`) as `earned` FROM (SELECT `Contract->Contractor`.`id` AS `id`, `Contract->Contractor`.`profession` AS `profession`, SUM(`price`) AS `earned` FROM `Jobs` AS `Job` INNER JOIN `Contracts` AS `Contract` ON `Job`.`ContractId` = `Contract`.`id` LEFT OUTER JOIN `Profiles` AS `Contract->Contractor` ON `Contract`.`ContractorId` = `Contract->Contractor`.`id` WHERE `Job`.`paymentDate` BETWEEN :start AND :end GROUP BY `Contract`.`id`)',
        { replacements: { start, end }, type: QueryTypes.SELECT },
      )
    ).filter((item) => item.id);
  }

  /**
   * Returns the clients the paid the most for jobs in the query time period
   *
   * @param {string} start The start date.
   * @param {string} end The end date.
   * @param {number} limit The result limit.
   *
   * @returns {Promise} The collection of the best clients.
   */
  getBestClients(start, end, limit = 2) {
    this.validateDates(start, end);

    /**
     * @todo: Rewrite it without native query (if it possible).
     */
    return sequelize.query(
      "SELECT `Contract->Client`.`id` AS `id`, `Contract->Client`.`lastName` || ' ' || `Contract->Client`.`firstName` as fullName, SUM(`price`) AS `paid` FROM `Jobs` AS `Job` INNER JOIN `Contracts` AS `Contract` ON `Job`.`ContractId` = `Contract`.`id` LEFT OUTER JOIN `Profiles` AS `Contract->Client` ON `Contract`.`ClientId` = `Contract->Client`.`id` WHERE `Job`.`paymentDate` BETWEEN :start AND :end GROUP BY `Contract`.`id` LIMIT :limit",
      { replacements: { start, end, limit }, type: QueryTypes.SELECT },
    );
  }

  /**
   * Validates the start and end date parameters.
   *
   * @private
   * @param {string} start The start date.
   * @param {string} end The end date.
   * @throws {BadRequestException} Will throw an error if dates are invalid.
   */
  validateDates(start, end) {
    const startDate = moment(start, 'YYYY-MM-DD', true);
    const endDate = moment(end, 'YYYY-MM-DD', true);

    if (!startDate.isValid() || !endDate.isValid()) {
      throw new BadRequestException(
        'Please use ISO date format for the "start" and "end" date parameters',
      );
    }

    if (startDate > endDate) {
      throw new BadRequestException('The "start" date must be less than the "end" date parameter');
    }
  }
}
