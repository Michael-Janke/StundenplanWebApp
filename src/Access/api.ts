import useSWR, { mutate } from 'swr';
import useMutation from 'use-mutation';
import { getToken } from '../Common/Authentication';
import { API_URL } from '../Common/services/generator';
import { fetchData } from '../Common/utils';

const get = async (url: string, endpoint = API_URL) => {
    const token = await getToken(endpoint);
    const response = await fetchData(endpoint + url, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });

    return response;
};

const fetchWrapper = (METHOD: 'POST' | 'PATCH') => async (url: string, data: any) => {
    const token = await getToken(API_URL);
    const response = await fetchData(API_URL + url, {
        method: METHOD,
        body: JSON.stringify(data),
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'Application/Json',
        },
    });

    return response;
};

const patch = fetchWrapper("PATCH")

const setAccess = async (data: Access) => {
    await patch('access/' + data.ROLE, { VERSION: data.VERSION });
    mutate('/access');
};

export const useSetAccess = () => useMutation(setAccess)

export type Access = {
    VERSION: number;
    ROLE: string;
};

export const useAccesses = () => useSWR<Array<Access>>('/access', get);

type Version = {
    VERSION: number;
    SCHOOLYEAR_ID: string;
    VERSION_ID: string;
};

export const useVersions = () => useSWR<Array<Version>>('/versions', get);
