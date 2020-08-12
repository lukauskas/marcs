import itertools

BATCH_SIZE = 50
HDF5_CHUNKSIZE = 2500


def grouper(iterable, n=BATCH_SIZE, fillvalue=None):

    args = [iter(iterable)] * n
    for batch in itertools.zip_longest(*args, fillvalue=fillvalue):
        yield [b for b in batch if b is not None]

def empty_or_split(x, sep=';', unique=True):
    if not x:
        return []
    else:
        data = x.split(sep)
        if unique:
            data = sorted(frozenset(data))
        return data