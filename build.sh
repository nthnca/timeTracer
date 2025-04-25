
$destinationFile =  "pkg/test_background.js"

# grab all the code between BEGIN_IMPORT_HERE & END_IMPORT_HERE from src/utils and dump to src/utils.js
sed -n '/BEGIN_IMPORT_HERE/,/END_IMPORT_HERE/p' src/test_utils.js | sed '1d;$d' > $destinationFile

cat "src/test_utils.js" >> $destinationFile

echo "build Complete at ($destinationFile)"
