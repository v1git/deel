// eslint-disable-next-line no-unused-vars
import express from 'express';
import AbstractController from './abstractController.js';

export default class ContractController extends AbstractController {
  /**
   * Contract details action.
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  async getOne(req, res, next) {
    const { id } = req.params;
    const { profile } = req;

    try {
      const contract = await this.service.getOne(id, profile);
      res.json(contract);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Contract list action.
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  async getMany(req, res, next) {
    const { profile } = req;
    try {
      const contracts = await this.service.getActiveByProfile(profile);

      res.json(contracts);
    } catch (e) {
      next(e);
    }
  }
}
