# breseq-gui

This package provides a MacOS X graphical user interface for running the [_breseq_](https://github.com/barricklab/breseq) pipeline for predicting mutations in microbial genomes.

Currently, you must [install _breseq_](https://barricklab.org/twiki/pub/Lab/ToolsBacterialGenomeResequencing/documentation/installation.html) on your own and make sure that it and its prerequisites (R and bowtie2) are all in your `$PATH` to use `breseq-gui`. The easiest way to do this if you are not familiar with the command line is to use these directions in the Terminal to [install BioConda](https://bioconda.github.io/user/install.html) and then [install the _breseq_ recipe](http://bioconda.github.io/recipes/breseq/README.html). This will automatically install and set up everything that you need.

## Developer Quick Start

`breseq-gui` is an [Electron Forge](https://www.electronforge.io/) project. You will need to install [npm](https://www.npmjs.com/get-np) for development. Then, you should be able to run this command from the main source directory for development:

```
npm start
```
