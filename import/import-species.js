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
    console.log("Spouštím check-species...");
    await runScript("import/check-species.js");
    console.log("check-species.js byl úspěšně dokončen.");

    const continueToNext = await askToContinue();

    if (continueToNext) {
      console.log("Spouštím import druhů...");
      await runScript("run-import-species.js");
      console.log("Import druhů byl úspěšně dokončen.");
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
