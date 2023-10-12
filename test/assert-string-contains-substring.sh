#!/bin/bash

name=''
string=''
substring=''


for arg in "$@"; do
    case $arg in
    --name)
        name=$2
        shift # Remove argument --name from `$@`
        shift # Remove argument value from `$@`
        ;;
    --string)
        string=$2
        shift # Remove argument --expected from `$@`
        shift # Remove argument value from `$@`
        ;;
    --substring)
        substring=$2
        shift # Remove argument --actual from `$@`
        shift # Remove argument value from `$@`
        ;;
    
    esac
done

echo "
Full value of $name: '$string'
Substring for $name: '$substring'"

if [[ $string == *"$substring"* ]]; then
  echo "The substring was found in $name"
else 
  echo "The substring was not found in $name"
  exit 1
fi