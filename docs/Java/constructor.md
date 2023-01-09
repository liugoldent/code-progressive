---
sidebar_position: 0
description: constructor
tags:
  - java
  - constructor
  - class
---

# 建構子

```java
public class Hello {
    // 與類別同名的方法，視為建構子
    public Hello(){
        // print vs print line(有換行)
        System.out.print("Mammal aaa");
        System.out.println("Mammal aaa");
    }
    public world(){
        System.out.println("Hello World");
    }
    // public static void main：為主要執行程式
	public static void main(String[] args){
        // 而在這主要執行程式中，new出一個自己（可行）
		Hello abc = new Hello();
        abc.world()
	}	
}
```