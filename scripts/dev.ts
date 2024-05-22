import console from 'node:console';
import concurrently from 'concurrently';

async function runDevMode() {
  try {
    const { result } = concurrently(
      [
        {
          name: 'rollup',
          command: 'tsx scripts/rollup/watch.ts',
          prefixColor: 'bgMagentaBright.bold',
        },
        {
          name: 'types',
          command: 'tsx scripts/dts/watch.ts',
          prefixColor: 'bgBlueBright.bold',
        },
      ],
      {
        timings: true,
        prefix: '{time} [{name}]',
        timestampFormat: 'HH:mm:ss:SSS',
        prefixColors: ['auto'],
        killOthers: ['failure', 'success'],
        restartTries: 1,
      },
    );

    const noOp = () => {};

    // We don't need to do anything here, most likely control + c was pressed to end the dev environment.
    result.then(noOp, noOp);
  } catch (error) {
    console.error('Error running processes:', error);
  }
}

runDevMode();
