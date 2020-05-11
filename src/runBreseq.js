const {ipcRenderer} = require('electron');
const childProcess = require('child_process');
const fs = require('fs')

var readFilePaths = [];
var referenceFilePaths = [];
var outputDirectoryPath = undefined;
var breseqCommand = "";
var advancedOptions = "";

var breseqProcess;
var breseqRunning = false;

// This fixes the PATH to include normal login scripts on MacOS X
const fixPath = require('fix-path');
fixPath();

function addOutputText(data) {

  // autoscroll if at bottom
  var autoScroll = false
  if (document.getElementById('breseqOutput').scrollTop + document.getElementById('breseqOutput').offsetHeight >= document.getElementById('breseqOutput').scrollHeight) {
    autoScroll = true
  }

  document.getElementById('breseqOutput').innerHTML = document.getElementById('breseqOutput').innerHTML + data.replace(/\n/g, "<br>");

  if (autoScroll) {
    //console.log("Scrolling Scrolling Scrolling...");
    document.getElementById('breseqOutput').scrollTop = document.getElementById('breseqOutput').scrollHeight;
  }
}

function runBreseq(event) {

  event.preventDefault() // stop the form from submitting

  // Need to run this to update command...
  checkRequiredOptionsToRunBreseq()

  // Now switch to the running view
  document.getElementById('breseqOutput').innerHTML = ""
  document.getElementById('runningPane').style.display = "block"
  document.getElementById('setupPane').style.display = "none"

  breseqRunning = true

  // We have to test bash as a backup from new default of zsh
  // to find the installation location of anaconda
  var theShell = '/bin/sh'

  addOutputText(theShell + "\n")
  addOutputText("env; " + breseqCommand + "\n")
  breseqProcess = childProcess.exec("env; " + breseqCommand, shell=theShell);

  breseqProcess.stdout.on('data', (data) => {
    //console.log(`stdout: ${data}`);
    addOutputText(data)
  });

  breseqProcess.stderr.on('data', (data) => {
    //console.log(`stderr: ${data}`);
    addOutputText(data)
  });

  breseqProcess.on('close', (code) => {
    breseqRunning = false
    //console.log(`breseq process exited with code ${code}`);

    // Link to output if it exists.
    const breseqOutputFilePath= outputDirectoryPath + "/output/index.html";

    fs.access(breseqOutputFilePath, fs.F_OK, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      document.getElementById('breseqOutputLink').innerHTML = "<a href=\"" + breseqOutputFilePath + "\" target=\"_blank\">" + "Click here to view <i>breseq</i> output!" + "</a>";
    });
  });

  console.log(theShell);


}

const {dialog} = require('electron').remote;


// Escapes double quotes and puts double quotes around it
function escapePathArgument(input) {
  return '"' + input.replace(/\"/g, "\\\"") + '"';
}

// Enables the runBreseq button if required inputs are provided
function checkRequiredOptionsToRunBreseq() {

  if ( readFilePaths.length && referenceFilePaths.length && (outputDirectoryPath !== undefined)) {
    document.getElementById("runBreseqButton").disabled = false;

    // escape all of the paths...
    escapedReferenceFilePaths = []
    for (i = 0; i < referenceFilePaths.length; i++) {
      escapedReferenceFilePaths[i] = escapePathArgument(referenceFilePaths[i]);
    }
    escapedReadFilePaths = []
    for (i = 0; i < readFilePaths.length; i++) {
      escapedReadFilePaths[i] = escapePathArgument(readFilePaths[i]);
    }
    escapedOutputDirectoryPath = escapePathArgument(outputDirectoryPath);

    breseqCommand = "breseq " + advancedOptions + " -o " + escapedOutputDirectoryPath + " -r " + escapedReferenceFilePaths.join(" -r ") + " " + escapedReadFilePaths.join(" ");
    document.getElementById("breseqCommand").innerHTML=breseqCommand;
    console.log(breseqCommand)
  } else {
    document.getElementById("runBreseqButton").disabled = true;

  }
}


// Events for when advanced option is changed

document.getElementById('advancedOptions').addEventListener('keyup', function(event) {
    advancedOptions = document.getElementById('advancedOptions').value;
    checkRequiredOptionsToRunBreseq()
});


// Events for clicking buttons to select files/directories

document.getElementById('referenceFileButton').addEventListener('click', function (event) {

    thePromise = dialog.showOpenDialog(null, {
        properties: ['openFile', 'multiSelections']
    });

    thePromise.then(function(theResult) {
      if(theResult.canceled) {
      } else {
        referenceFilePaths = theResult.filePaths;
        document.getElementById("referenceFilePaths").innerHTML = "<li>" + referenceFilePaths.join("</li><li>") + "</li>";
        checkRequiredOptionsToRunBreseq();
      }
    });

});

document.getElementById('readFileButton').addEventListener('click', function (event) {

    thePromise = dialog.showOpenDialog(null, {
        properties: ['openFile', 'multiSelections']
    });

    thePromise.then(function(theResult) {
      if(theResult.canceled) {
      } else {
        readFilePaths = theResult.filePaths;
        document.getElementById("readFilePaths").textContent = readFilePaths.join("\n");
        checkRequiredOptionsToRunBreseq();
      }
    });
});

document.getElementById('outputDirectoryButton').addEventListener('click', function (event) {

    thePromise = dialog.showOpenDialog(null, {
        properties: ['openDirectory', 'createDirectory']
    });

    thePromise.then(function(theResult) {
      if(theResult.canceled) {
      } else {
        outputDirectoryPath = theResult.filePaths[0];
        document.getElementById("outputDirectoryPath").textContent = outputDirectoryPath;
        checkRequiredOptionsToRunBreseq();
      }
    });
});

// Cancel button

document.getElementById('endRunButton').addEventListener('click', function (event) {

  document.getElementById('runningPane').style.display = "none"
  document.getElementById('setupPane').style.display = "block"

  if (breseqRunning) {
    breseqRunning = false
    breseqProcess.kill('SIGINT')
    console.log(`killing`);
  }
});


