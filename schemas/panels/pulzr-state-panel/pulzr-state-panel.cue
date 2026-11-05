package model

import (
	"strings"
)

// A theme color by name, or a hex color.
#color: "success" | "warning" | "error" | "info" | "primary" | "neutral" | =~"^#(?:[0-9a-fA-F]{3}){1,2}$"

kind: "PulzrStatePanel"
spec: close({
	states?: [...close({
		value:  number | bool
		label:  strings.MinRunes(1)
		color?: #color
	})]
	bits?: [...close({
		bit:    int & >=0 & <=52
		label:  strings.MinRunes(1)
		color?: #color
	})]
	staleAfter?: number & >0
	labels?: [string]: string
})
