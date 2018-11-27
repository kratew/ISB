#!/bin/bash

echo "--------Start---------"
pushd /root/ISB

date

echo " * git pull"

git pull

if [ $? -ne 0 ] ; then
	echo "!!!!!!! check error !!!!!!!!!"
	exit 1
fi

echo " * Deploy"

popd

echo "---------End----------"
