#!/bin/bash
until node index.js; do
    echo "PiNodePlayer crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
