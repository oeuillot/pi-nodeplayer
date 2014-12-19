#!/bin/bash
until node /home/olivier/sources/pinodeplayer/index.js; do
    echo "PiNodePlayer crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
