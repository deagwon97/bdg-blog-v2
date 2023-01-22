#!/bin/bash
for ((count=0 ; count < 360 ; count++))
do
    IFS=" "
    string="`./kubectl get pods --field-selector=status.phase==Succeeded --output=jsonpath={.items[*].metadata.name}`"
    array=( $string )
    value="kaniko-front"
    echo "${IFS}${array[*]}${IFS}"
    if [[ "${IFS}${array[*]}${IFS}" =~ "${IFS}${value}${IFS}" ]]; then
        echo 'completed' 
        ./kubectl delete pod kaniko-front
        exit
    else 
        echo 'running' 
    fi
    echo $count;
    sleep 10
    unset IFS
done

echo "Too long to build image. The time for building is up to one hour."
exit 1