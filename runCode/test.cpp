#include <iostream>

class MyClass {
public:
    explicit MyClass(int value) : data(value) {
        std::cout << "Constructor called with value: " << value << std::endl;
    }

    int getData() const {
        return data;
    }

private:
    int data;
};

void printData(const MyClass& obj) {
    std::cout << "Data: " << obj.getData() << std::endl;
}

int main() {
    MyClass obj1 = 10; // 錯誤，無法使用隱式轉換
    MyClass obj2(20); // 正確，使用顯式轉換

    printData(obj1);
    printData(obj2);

    return 0;
}
