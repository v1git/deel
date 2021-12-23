import getProfile from './middleware/getProfile.js';
import ContractController from './controller/contractController.js';
import JobController from './controller/jobController.js';
import ContractService from './service/contractService.js';
import JobService from './service/jobService.js';
import BalanceService from './service/balanceService.js';
import BalanceController from './controller/balanceController.js';
import StatisticsController from './controller/statisticsController.js';
import StatisticsService from './service/statisticsService.js';
import BadRequestException from './exception/badRequestException.js';
import NotFoundException from './exception/notFoundException.js';
import ForbiddenException from './exception/forbiddenException.js';

// Init services
const contractService = new ContractService();
const jobService = new JobService();
const balanceService = new BalanceService(jobService);
const statisticsService = new StatisticsService();
// Init controllers
const contractController = new ContractController(contractService);
const jobController = new JobController(jobService);
const balanceController = new BalanceController(balanceService);
const statisticsController = new StatisticsController(statisticsService);

export default (app) => {
  app.get('/contracts/:id', getProfile, async (req, res, next) =>
    contractController.getOne(req, res, next),
  );

  app.get('/contracts', getProfile, async (req, res) => contractController.getMany(req, res));

  app.get('/jobs/unpaid', getProfile, async (req, res) => jobController.getUnpaid(req, res));

  app.post('/jobs/:jobId/pay', getProfile, async (req, res) => jobController.pay(req, res));

  app.post('/balances/deposit/:userId', getProfile, async (req, res) =>
    balanceController.deposit(req, res),
  );

  app.get('/admin/best-profession', getProfile, async (req, res) =>
    statisticsController.profession(req, res),
  );

  app.get('/admin/best-clients', getProfile, async (req, res) =>
    statisticsController.clients(req, res),
  );

  app.get('*', (_req, res) =>
    res.status(404).send({
      message: 'Not Found',
    }),
  );

  // eslint-disable-next-line no-unused-vars
  app.use((e, _req, res, next) => {
    if (
      e instanceof ForbiddenException ||
      e instanceof NotFoundException ||
      e instanceof BadRequestException
    ) {
      res.status(e.status).send({
        message: e.message,
      });
    } else {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  });
};
