# breseq-gui

This package provides a MacOS X graphical user interface for running the [_breseq_](https://github.com/barricklab/breseq) pipeline for predicting mutations in microbial genomes.

Currently, you must [install _breseq_](https://barricklab.org/twiki/pub/Lab/ToolsBacterialGenomeResequencing/documentation/installation.html) on your own and make sure that it and its prerequisites (R and bowtie2) are all in your `$PATH` to use `breseq-gui`. 

The easiest way to do this if you are not familiar with the command line is to use these directions in the Terminal to [install BioConda](https://bioconda.github.io/) and then [install the _breseq_ recipe](http://bioconda.github.io/recipes/breseq/README.html). This will automatically install and set up everything that you need.

If you get errors related to R when running _breseq_ installed through conda, run this additional command to fix them:
```
conda update -c rdonnellyr -c main --all
```

## Developer Quick Start

`breseq-gui` is an [Electron Forge](https://www.electronforge.io/) project. For development, you will need to [install npm](https://www.npmjs.com/get-np) and then [install Electron](https://www.electronjs.org/docs/tutorial/installation).

You should now be able to run this command from the main source directory to launch the repository version of **breseq-gui**:

```
npm start
```
