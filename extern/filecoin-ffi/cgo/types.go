package cgo

/*
#include "../filcrypto.h"
#include <stdlib.h>
*/
import "C"

type FvmMachine = C.InnerFvmMachine_t
