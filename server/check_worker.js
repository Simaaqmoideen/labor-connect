const { Worker, JobProvider, Admin } = require('./models');
const run = async () => {
  try {
    const workers = await Worker.findAll();
    console.log('Workers:', workers.map(w => ({ id: w.id, email: w.email, phone: w.phone })));
    const providers = await JobProvider.findAll();
    console.log('Providers:', providers.map(p => ({ id: p.id, email: p.email, phone: p.phone })));
    const admins = await Admin.findAll();
    console.log('Admins:', admins.map(a => ({ id: a.id, email: a.email })));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
