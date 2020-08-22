#!/bin/bash

export VERSION=$1

npm run build

zip -q -r dist.zip dist/