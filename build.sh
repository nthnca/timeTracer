
set -e

#
## front_end
#

destinationFile_BE="pkg/background.js"
destinationFile_FE="pkg/popup/index.js"

rm "$destinationFile_FE"
touch "$destinationFile_FE"

# grab all the code between BEGIN_IMPORT_HERE & END_IMPORT_HERE from src/urlDataObj and dump to pkg/background.js
sed -n '/ADD_TO_FRONT_END_START/,/ADD_TO_FRONT_END_END/p' src/chrome_api.js | sed '1d;$d' >> "$destinationFile_FE"

# grab all the code between BEGIN_IMPORT_HERE & END_IMPORT_HERE from src/urlDataObj and dump to pkg/background.js
sed -n '/BEGIN_IMPORT_HERE/,/END_IMPORT_HERE/p' src/front_end.js | sed '1d;$d' >> "$destinationFile_FE"

echo "build Complete at ($destinationFile_FE)"

#
## back_end
#

rm "$destinationFile_BE"
touch "$destinationFile_BE"

# grab all the code between BEGIN_IMPORT_HERE & END_IMPORT_HERE from src/urlDataObj and dump to pkg/background.js
sed -n '/BEGIN_IMPORT_HERE/,/END_IMPORT_HERE/p' src/urlDataObj.js | sed '1d;$d' >> "$destinationFile_BE"

# grab all the code between BEGIN_IMPORT_HERE & END_IMPORT_HERE from src/utils and dump to pkg/background.js
sed -n '/BEGIN_IMPORT_HERE/,/END_IMPORT_HERE/p' src/utils.js | sed '1d;$d' >> "$destinationFile_BE"

cat "src/chrome_api.js" >>  "$destinationFile_BE"

# build the front end first so this can run after the ft-end is done
sed -i '/ADD_TO_FRONT_END_START/,+1d' pkg/background.js
sed -i '/ADD_TO_FRONT_END_END/,+1d' pkg/background.js

echo "build Complete at ($destinationFile_BE)"
