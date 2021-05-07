#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdint.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

extern void log_value(char *str);

EMSCRIPTEN_KEEPALIVE int add(int a, int b)
{
    return a + b;
}

EMSCRIPTEN_KEEPALIVE void print(char *str) {
    log_value(str);
}

EMSCRIPTEN_KEEPALIVE char *reverse(char *str)
{
    size_t len = strlen(str);
    char *reverse_str = strdup(str);

    for (int i = 0; i < len / 2; i++)
    {
        reverse_str[i] = str[len-i-1];
        reverse_str[len-i-1] = str[i];
    }

    return reverse_str;
}

EMSCRIPTEN_KEEPALIVE char *send_string(char *str)
{
    return str;
}

EMSCRIPTEN_KEEPALIVE int64_t send_int64_max_value()
{
    return 0x7FFFFFFFFFFFFFFF;
}