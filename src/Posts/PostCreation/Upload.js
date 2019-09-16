import React from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import { getToken } from '../../Common/Authentication';
import { API_URL } from '../../Common/services/generator';
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

export default function Upload(props) {
    return (
        <FilePond
            name="files"
            allowMultiple={props.allowMultiple}
            acceptedFileTypes={props.acceptedFileTypes}
            onupdatefiles={props.onUpdate}
            onprocessfiles={props.onFinished}
            labelIdle={'Bild hier reinziehen oder hier klicken für Dateidialog'}
            server={{
                url: API_URL + 'upload',
                revert: (filename, load, error) => {
                    getToken(API_URL)
                        .then(token => {
                            return fetch(API_URL + 'upload/' + filename, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                },
                                method: 'DELETE',
                            });
                        })
                        .then(load)
                        .catch(error);
                },
                process: (fieldName, file, metadata, load, error, progress, abort) => {
                    // fieldName is the name of the input field
                    // file is the actual file object to send
                    const formData = new FormData();
                    formData.append(fieldName, file, file.name);

                    const request = new XMLHttpRequest();
                    request.open('POST', API_URL + 'upload');

                    // Should call the progress method to update the progress to 100% before calling load
                    // Setting computable to false switches the loading indicator to infinite mode
                    request.upload.onprogress = e => {
                        progress(e.lengthComputable, e.loaded, e.total);
                    };

                    // Should call the load method when done and pass the returned server file id
                    // this server file id is then used later on when reverting or restoring a file
                    // so your server knows which file to return without exposing that info to the client
                    request.onload = function() {
                        if (request.status >= 200 && request.status < 300) {
                            // the load method accepts either a string (id) or an object
                            load(API_URL + 'upload/' + JSON.parse(request.responseText).FILENAME);
                        } else {
                            // Can call the error method if something is wrong, should exit after
                            error('oh no');
                        }
                    };

                    getToken(API_URL).then(token => {
                        request.setRequestHeader('Authorization', 'Bearer ' + token);
                        request.send(formData);
                    });

                    // Should expose an abort method so the request can be cancelled
                    return {
                        abort: () => {
                            // This function is entered if the user has tapped the cancel button
                            request.abort();

                            // Let FilePond know the request has been cancelled
                            abort();
                        },
                    };
                },
            }}
        />
    );
}
