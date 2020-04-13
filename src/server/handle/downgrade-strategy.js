import os from 'os';

export default function defaultDowngradeStrategy() {
  const overload = os.loadavg();
  const cpuNumber = os.cpus().length;
  const isTooHight = overload[0] > cpuNumber;

  return isTooHight;
}
