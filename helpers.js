function addSpacesByHierarchy(obj, level = 0, spacing = 2) {
  const space = " ".repeat(spacing);

  for (const key in obj) {
    console.log(space.repeat(level) + key)
    if (typeof obj[key] === 'object') {
      addSpacesByHierarchy(obj[key], level + 1, spacing);
    }
  }
}

function removeExtraSpaces(str) {
  const regex = /\s\s+/g;
  return str.replace(regex, " ").trim();
}

function find(dir, path) {
  if (path.length == 1) {
    if (path[0] in dir) return ([dir[path[0]], path[0], dir])
    else return [null, path[0]]
  } else if (path.length > 1 && path[0] in dir) {
    return find(dir[path[0]], path.slice(1))
  } else {
    return ([null, path[0]])
  }
}


module.exports = {
  addSpacesByHierarchy, removeExtraSpaces, find
}