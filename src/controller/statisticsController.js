// eslint-disable-next-line no-unused-vars
import express from 'express';
import AbstractController from './abstractController.js';

export default class StatisticsController extends AbstractController {
  /**
   * Best profession action.
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  async profession(req, res, next) {
    const { start, end } = req.query;

    try {
      const profession = await this.service.getBestProfession(start, end);

      res.json(profession);
    } catch (e) {
      next(e);
    }
  }

  /**
   * List of best client action.
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  async clients(req, res, next) {
    const { start, end, limit } = req.query;

    try {
      const profession = await this.service.getBestClients(start, end, limit);

      res.json(profession);
    } catch (e) {
      next(e);
    }
  }
}
