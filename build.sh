
set -e

destinationFile="pkg/background.js"

rm "$destinationFile"
touch "$destinationFile"

# grab all the code between BEGIN_IMPORT_HERE & END_IMPORT_HERE from src/urlDataObj and dump to pkg/background.js
sed -n '/BEGIN_IMPORT_HERE/,/END_IMPORT_HERE/p' src/urlDataObj.js | sed '1d;$d' >> "$destinationFile"

# grab all the code between BEGIN_IMPORT_HERE & END_IMPORT_HERE from src/utils and dump to pkg/background.js
sed -n '/BEGIN_IMPORT_HERE/,/END_IMPORT_HERE/p' src/test_utils.js | sed '1d;$d' >> "$destinationFile"

cat "src/chrome_api.js" >>  "$destinationFile"

echo "build Complete at ($destinationFile)"
