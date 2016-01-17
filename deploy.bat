git checkout master

git add .

SET /P comment=Comment: 
git commit -m "%comment%"

git push origin master

git checkout gh-pages

git stash

git rebase master

git push origin gh-pages -f

git checkout master

PAUSE

