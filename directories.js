const readline = require("readline");
const {
  ACTION
} = require("./constants")
const {
  removeExtraSpaces, addSpacesByHierarchy, find
} = require("./helpers")


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const hasSlashRegex = /\//;

function create(dir, path) {
  if (path.length == 1) dir[path[0]] = {}
  else if (path.length > 1) {
    create(dir[path[0]], path.slice(1))
  }
}

function list(dir) {
  addSpacesByHierarchy(dir)
}

function deleteDir(dir, path, fullPath) {
  if (path.length == 1) {
    if (path[0] in dir) delete dir[path[0]]
    else console.log(`Cannot delete ${fullPath} - ${path[0]} does not exist`)
  } else if (path.length > 1 && path[0] in dir) {
    deleteDir(dir[path[0]], path.slice(1), fullPath)
  } else {
    console.log(`Cannot delete ${fullPath} - ${path[0]} does not exist`)
  }
}

function move(dir, from, to) {
  const fromPath = hasSlashRegex.test(from) ? from.split("/") : [from]
  const toPath = hasSlashRegex.test(to) ? to.split("/") : [to]

  const [fromObj, fromKey, parentObj] = find(dir, fromPath)
  if (fromObj == null) return console.log(`Cannot move - "${fromKey}" does nor exist`)
  const [toObj, toKey] = find(dir, toPath)
  if (toObj == null) return console.log(`Cannot move - "${toKey}" does nor exist`)

  toObj[fromKey] = { ...fromObj }
  delete parentObj[fromKey]
}

(() => {
  const dir = {}

  const collectCommand = (command) => {
    const args = removeExtraSpaces(command).split(" ")
    const action = args[0]
    const dirName = args[1]


    switch (action) {
      case ACTION.CREATE:
        if (dirName == undefined) {
          console.error('command CREATE requires 1 arg.');
        } else {
          const path = hasSlashRegex.test(dirName) ? dirName.split("/") : [dirName]
          create(dir, path)
        }
        break;
      case ACTION.MOVE:
        const movePath = [args[1], args[2]]
        if (movePath.includes(undefined)) {
          console.error('command MOVE requires 2 args.');
        } else {
          const [from, to] = movePath
          move(dir, from, to)
        }
        break;
      case ACTION.DELETE:
        if (dirName == undefined) {
          console.error('command DELETE requires 1 arg.');
        } else {
          const path = hasSlashRegex.test(dirName) ? dirName.split("/") : [dirName]
          deleteDir(dir, path, dirName)
        }
        break;
      case ACTION.LIST:
        list(dir)
        break;
      default:
        console.error('Invalid command.');
    }

    rl.question("", collectCommand);
  };

  rl.question("", collectCommand);
})()
