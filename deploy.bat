git checkout master

git add .

SET /P comment=Comment: 
git commit -m "%comment%"

git push origin master

git checkout gh-pages

git rebase master

git push origin gh-pages

git checkout master

