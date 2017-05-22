#!/bin/bash

project=$1

if [ -z $project ]; then
  echo "github project name is required but is empty, later"
  exit -1
fi

project_dir="repos/$project"
cwd=`pwd`
user="FiresqueakLLC"

rm -rf repos
git clone git@github.com:$user/$project.git $project_dir
cp -r lib site $project_dir

cd $project_dir
git add .
git commit -m 'updates to lib and site'
git push origin master

cd $cwd

open https://$user.github.io/$project/site/
