path=`pwd`


find . -name 'package.json' | grep -v node_modules | sed -r 's|/[^/]+$||' | while read line
do
  cd ${line}
  pwd
  npm test
  cd ${path}
done
