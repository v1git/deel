// eslint-disable-next-line no-unused-vars
import express from 'express';
import AbstractController from './abstractController.js';

export default class BalanceController extends AbstractController {
  /**
   * Deposit action.
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  async deposit(req, res, next) {
    const { userId } = req.params;

    try {
      const amount = parseInt(req.body.amount, 10);
      const balance = await this.service.deposit(userId, amount);

      res.json(balance);
    } catch (e) {
      next(e);
    }
  }
}
