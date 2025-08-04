local Pipeline(rubyVer, license, db, redmine) = {
  kind: "pipeline",
  name: rubyVer + "-" + db + "-" + redmine + "-" + license,
  steps: [
    {
      name: "tests",
      image: "redmineup/redmineup_ci",
      commands: [
        "service postgresql start && service mysql start && sleep 5",
        "export PLUGIN_ALIAS=redmineup_cms",
        "export PATH=~/.rbenv/shims:$PATH",
        "export CODEPATH=`pwd`",
        "/root/run_for.sh redmine_cms ruby-" + rubyVer + " " + db + " redmine-" + redmine
      ]
    }
  ]
};

[
  Pipeline("3.2.2", "pro", "mysql", "trunk"),
  Pipeline("3.2.2", "light", "pg", "trunk"),
  Pipeline("3.0.6", "pro", "mysql", "5.0"),
  Pipeline("2.7.8", "light", "mysql", "4.2"),
  Pipeline("2.7.8", "pro", "pg", "4.2"),
  Pipeline("2.3.8", "pro", "mysql", "4.0"),
  Pipeline("2.3.8", "light", "mysql", "4.0"),
  Pipeline("2.3.8", "pro", "pg", "4.0")
]
