var UIEvent = {}

UIEvent.event_type = {
    Add:        1,
    Delete:     2,
    Change:     3,
    Swap:       4,

    CursorMove: 15,
    CursorRMove: 16,
    CursorLMove: 17,

    Normal:     20,
    PickPivot:  21,
    Attention:  22,
}

UIEvent.buildEvent = function(et, data, context) {
    return {
        d: data,
        type: et,
        ectx: context
    };
}


