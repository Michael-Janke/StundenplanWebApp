var fs = require('fs');
var fileName = './src/version.json';
var file = require(fileName);
var path = require('path');

var NodeGit = require("nodegit");

NodeGit.Repository.open(path.resolve(__dirname, ".git"))
  .then(function (repo) {
    return repo.getStatus()
      .then(function (statuses) {
        if (statuses.length) {
          throw Error("you have uncommitted changes, please commit changes");
        }
        return repo;
      })
  })
  .then(function (repo) {
    file.build = file.build + 1;
    fs.writeFile(path.join(__dirname, fileName), JSON.stringify(file), function (err) {
      if (err) return console.log(err);
      console.log(JSON.stringify(file, null, 4));
      console.log('increment build number ' + fileName);

      repo.refreshIndex()
        .then(async (index) => {
          const head = await NodeGit.Reference.nameToId(repo, "HEAD");
          const sig = await NodeGit.Signature.default(repo);
          const commitId = await repo.createCommitOnHead(
            [path.posix.join(fileName)],
            sig,
            sig,
            "build " + file.build,
          );
          console.log("committed " + commitId);
        }).catch(error => console.error(error))
    });
  }).catch(function (statuses) {
    console.error(statuses);
    process.exitCode = 1;
  });