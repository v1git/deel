// eslint-disable-next-line no-unused-vars
import express from 'express';
import AbstractController from './abstractController.js';

export default class JobController extends AbstractController {
  /**
   * Unpaid jobs list action.
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  async getUnpaid(req, res, next) {
    const { profile } = req;
    try {
      const jobs = await this.service.getUnpaidByProfile(profile);

      res.json(jobs);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Pay action.
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  async pay(req, res, next) {
    const { jobId } = req.params;
    const { profile } = req;

    try {
      const jobs = await this.service.pay(jobId, profile);

      res.json(jobs);
    } catch (e) {
      next(e);
    }
  }
}
