#include <emscripten/bind.h>

using namespace emscripten;

class Counter
{
public:
    int counter;

    Counter(int initial)
    {
        counter = initial;
    }

    void increment()
    {
        counter++;
    }

    void decrement()
    {
        counter--;
    }
};

EMSCRIPTEN_BINDINGS(my_module)
{
    class_<Counter>("MyCounter")
        .constructor<int>()
        .function("increment", &Counter::increment)
        .function("decrement", &Counter::decrement)
        .property("counter", &Counter::counter);
}