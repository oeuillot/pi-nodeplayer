#!/bin/bash

MOVIES_PATH="$1";

until node index.js -o hdmi -p -b --moviesBasePath $MOVIES_PATH; do
    echo "pi-nodeplayer crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
