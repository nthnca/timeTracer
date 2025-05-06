#!/bin/bash
grep -rnw "./src" -e "// TODO:" | sed 's/^[^/]*\/\//\t\/\//'
