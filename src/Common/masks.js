
export function createMask(...masks) {
    return (substitution) =>
        masks.reduce((prev, current) => {
            return current(prev);
        }, substitution);
}


export const transform = (variant) => variant === 'old' ? transformOld : variant === 'new' ? transformNew : null;

export const fromViewer = (substitution) => {
    const { id, type } = substitution;
    if (type === 'student' || type === 'class') {
        return transform('new')(substitution);
    }
    const key = type.toUpperCase() + "_ID";
    const isOld = substitution[key] === id;
    const isNew = substitution[key + "_NEW"] === id || substitution[key + "_NEW"] === 0;
    return transform(isNew ? 'new' : isOld ? 'old' : 'new')(substitution);
}

export const removeIf = ifType => (substitution) => {
    const { type } = substitution;
    if (ifType === type && substitution.isOld) {
        return null;
    }
    return substitution;
}

export const addSubstitutionInformation = (substitution) => {
    const { type } = substitution;
    return {
        ...substitution,
        substitutionInfo: (substitution.SUBJECT_ID_SUBSTITUTING && type === 'teacher') ? substitution.isOld ? 'instead-by' : 'instead-of' : null,
    }
}

function transformOld(substitution) {
    return {
        ...substitution,
        isOld: true,
        SUBJECT_ID: substitution.SUBJECT_ID || substitution.SUBJECT_ID_NEW,
        TEACHER_ID: substitution.TEACHER_ID || substitution.TEACHER_ID_NEW,
        ROOM_ID: substitution.ROOM_ID || substitution.ROOM_ID_NEW,
        CLASS_IDS: (substitution.CLASS_IDS && substitution.CLASS_IDS.length && substitution.CLASS_IDS) || substitution.CLASS_IDS_NEW,
        SUBJECT_ID_NEW: substitution.SUBJECT_ID_NEW ? 0 : null,
        CLASS_IDS_NEW: substitution.CLASS_IDS_NEW ? 0 : null,
        TEACHER_ID_NEW: substitution.TEACHER_ID_NEW ? 0 : null,
        ROOM_ID_NEW: substitution.ROOM_ID_NEW ? 0 : null,
        SUBJECT_ID_SUBSTITUTING: substitution.SUBJECT_ID_NEW,
        TEACHER_ID_SUBSTITUTING: substitution.TEACHER_ID_NEW,
        ROOM_ID_SUBSTITUTING: substitution.ROOM_ID_NEW,
        CLASS_IDS_SUBSTITUTING: substitution.CLASS_IDS_NEW,
    }
}

function transformNew(substitution) {
    return {
        ...substitution,
        isOld: false,
        SUBJECT_ID_NEW: substitution.SUBJECT_ID_NEW || substitution.SUBJECT_ID,
        TEACHER_ID_NEW: substitution.TEACHER_ID_NEW || substitution.TEACHER_ID,
        ROOM_ID_NEW: substitution.ROOM_ID_NEW || substitution.ROOM_ID,
        CLASS_IDS_NEW: (substitution.CLASS_IDS_NEW && substitution.CLASS_IDS_NEW.length && substitution.CLASS_IDS_NEW) || substitution.CLASS_IDS,
        SUBJECT_ID: substitution.SUBJECT_ID_NEW !== substitution.SUBJECT_ID ? 0 : null,
        CLASS_IDS: substitution.CLASS_IDS ? 0 : null,
        TEACHER_ID: substitution.TEACHER_ID ? 0 : null,
        ROOM_ID: substitution.ROOM_ID_NEW !== substitution.ROOM_ID ? 0 : null,
        SUBJECT_ID_SUBSTITUTING: substitution.SUBJECT_ID,
        TEACHER_ID_SUBSTITUTING: substitution.TEACHER_ID,
        ROOM_ID_SUBSTITUTING: substitution.ROOM_ID,
        CLASS_IDS_SUBSTITUTING: substitution.CLASS_IDS,
    }
}