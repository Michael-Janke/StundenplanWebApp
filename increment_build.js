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
          await index.addByPath(path.posix.join(fileName));
          await index.write();
          const oid = await index.writeTree();
          const head = await NodeGit.Reference.nameToId(repo, "HEAD");
          const parent = await repo.getCommit(head);
          const commitId = await repo.createCommit(
            "HEAD",
            NodeGit.Signature.default(repo),
            NodeGit.Signature.default(repo),
            "build " + file.build,
            oid,
            [parent]
          );
          console.log("committed " + commitId);
        }).catch(error => console.error(error))
    });
  }).catch(function (statuses) {
    console.error(statuses);
    process.exitCode = 1;
  });