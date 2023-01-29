#! /usr/bin/env node

import yargs from "yargs";
import chalk from "chalk";
import fs from "fs";
import { argv } from "process";

const createFile = (filename) => {
  console.log(`Creating the file ${filename}`);
  var createStream = fs.createWriteStream(`${filename}`);
  createStream.end();
  console.log(chalk.green(`${filename} created`));
};

const camelToSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter, index) => {
    return index == 0 ? letter.toLowerCase() : "_" + letter.toLowerCase();
  });

const generateBlocCode = (blocName) => {
  console.log(`Generating code for bloc file`);
  var writeStream = fs.createWriteStream(
    `bloc/${camelToSnakeCase(blocName)}_bloc.dart`,
  );
  writeStream.write(`import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';

part '${camelToSnakeCase(blocName)}_event.dart';
part '${camelToSnakeCase(blocName)}_state.dart';

class ${blocName} extends Bloc<${blocName}Event, ${blocName}State> {
    ${blocName}Bloc() : super(${blocName}State()) {
    on<${blocName}InitEvent>((event, emit) async {
    });
  }
}
`);
  writeStream.end();
  console.log(chalk.green(`File updated`));
};

const generateEventCode = (blocName) => {
  console.log(`Generating code for event file`);
  var writeStream = fs.createWriteStream(
    `bloc/${camelToSnakeCase(blocName)}_event.dart`,
  );
  writeStream.write(`part of '${camelToSnakeCase(blocName)}_bloc.dart';

  @immutable
  abstract class ${blocName}Event extends Equatable {
    const ${blocName}Event();
    @override
    List<Object> get props => [];
  }
  
  class ${blocName}InitEvent extends ${blocName}Event {
    const ${blocName}InitEvent();
  
    @override
    List<Object> get props => [];
  }`);
  writeStream.end();
  console.log(chalk.green(`File updated`));
};

const generateStateCode = (blocName) => {
  console.log(`Generating code for state file`);
  var writeStream = fs.createWriteStream(
    `bloc/${camelToSnakeCase(blocName)}_state.dart`,
  );
  writeStream.write(`part of '${camelToSnakeCase(blocName)}_bloc.dart';
  class ${blocName}State extends Equatable {
    const ${blocName}State();
  
    @override
    List<Object?> get props => [];
  }`);
  writeStream.end();
  console.log(chalk.green(`File updated`));
};

const creatingBloc = (ya) => {
  console.log(chalk.bold.blue(`Generating Bloc for ${ya.argv.name}`));
  console.log(`Creating the bloc directory inside current folder`);
  if (!fs.existsSync("bloc")) {
    fs.mkdirSync("bloc");
  }
  console.log(chalk.green("bloc directory created"));

  createFile(`bloc/${camelToSnakeCase(ya.argv.name)}_bloc.dart`);
  generateBlocCode(`${ya.argv.name}`);
  createFile(`bloc/${camelToSnakeCase(ya.argv.name)}_state.dart`);
  generateStateCode(`${ya.argv.name}`);
  createFile(`bloc/${camelToSnakeCase(ya.argv.name)}_event.dart`);
  generateEventCode(`${ya.argv.name}`);

  console.log(chalk.bold.blue("Bloc generated successfully!"));
};

const options = yargs(argv.slice(2))
  .command("create", "create new flutter bloc", creatingBloc)
  .option("name", {
    alias: "n",
    type: String,
    demandOption: true,
    description: "Please provide the name for the bloc",
  })
  .usage("Usage: create -n <name>")
  .help(true).argv;
