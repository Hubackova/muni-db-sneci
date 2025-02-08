const { exec } = require("child_process");
const readline = require("readline");

function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    exec(`node ${scriptName}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing script ${scriptName}: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
}
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askToContinue() {
  return new Promise((resolve) => {
    rl.question("Chceš pokračovat a spustit import? (y/n): ", (answer) => {
      if (answer.toLowerCase() === "y") {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

async function runScripts() {
  try {
    console.log("Spouštím check-localities...");
    await runScript("import/check-localities.js");
    console.log("check-localities.js byl úspěšně dokončen.");

    const continueToNext = await askToContinue();

    if (continueToNext) {
      console.log("Spouštím import lokalit...");
      console.log("Tohle je test, takže se nic nestane");
      //   await runScript('import-localities-func.js');
      //   console.log('Třetí skript byl úspěšně dokončen.');
    } else {
      console.log("Import byl zastaven.");
      rl.close();
    }

    process.exit(0);
  } catch (error) {
    console.error("Chyba:", error);
    process.exit(1);
  }
}

runScripts();
