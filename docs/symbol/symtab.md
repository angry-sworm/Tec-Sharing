# 符号
* 在一种认知体系中，符号是指代一定意义的意象，可以是图形图像、文字组合，也可以是声音信号、建筑造型，甚至可以是一种思想文化、一个时事人物。
* 为了更为直观的表达某个含义而设计的，比如我们说"球"的时候，可以不说球，可以说一个圆圆、鼓鼓的可以滚动的物体，但是这样太复杂，于是发明了球；在人类早期的时候，名词还没有太多，很多时候就用形容词来表达名词的含义。在这个基础上如果进一步简化，就出现了符号，就是事物越来越容易认知的过程。
* 不同的领域有不同的符号，但是也可能会出现交叉。比如@符号，在邮箱、URI、微博、微信中的使用
## 符号学(Semiotics)
* 符号学即是一门分析征象(sign)系统如何运作的科学，探索意义如何透过符码、记号，在人类的沟通过程中被生产与传递
* 
## 符号表
* 符号 (Symobl): 每个目标文件都有符号表 (SYMBOL TABLE)，包含已定义的符号 (对 应全局变量和 static 变量和定义的函数名字) 和未定义符号 (未定义的函数的名字和引 用但没定义的符号) 信息。
* 符号值： 每个符号对应一个地址。即符号指 (这与 C 程序内变量的值不一样，某种 情况下可以堪称变量地址) 可以使用 nm 命令查看
* 符号表是一种用于语言翻译器（例如编译器和解释器）中的数据结构。在符号表中，程序源代码中的每个标识符都和它的声明或使用信息绑定在一起，比如其数据类型、作用域以及内存地址。
* 目标文件中通常会有一个包含了所有外部可见标识符的符号表。在链接不同的目标文件时，链接器会使用这些文件中的符号表来解析所有未解析的符号引用，链接后，EXE文件中也有符号用于定位地址，但是可以被strip

## 用C直观查看
```
int
main() {
printf("hello");
return 0;
}
-----------------------------------------------------------------------------
objdump -t hello 

hello:     file format elf64-x86-64

SYMBOL TABLE:
0000000000400238 l    d  .interp        0000000000000000              .interp
0000000000400254 l    d  .note.ABI-tag  0000000000000000              .note.ABI-tag
0000000000400274 l    d  .note.gnu.build-id     0000000000000000              .note.gnu.build-id
0000000000400298 l    d  .gnu.hash      0000000000000000              .gnu.hash
00000000004002b8 l    d  .dynsym        0000000000000000              .dynsym
0000000000400318 l    d  .dynstr        0000000000000000              .dynstr
0000000000400358 l    d  .gnu.version   0000000000000000              .gnu.version
0000000000400360 l    d  .gnu.version_r 0000000000000000              .gnu.version_r
0000000000400380 l    d  .rela.dyn      0000000000000000              .rela.dyn
0000000000400398 l    d  .rela.plt      0000000000000000              .rela.plt
00000000004003c8 l    d  .init  0000000000000000              .init
00000000004003f0 l    d  .plt   0000000000000000              .plt
0000000000400420 l    d  .plt.got       0000000000000000              .plt.got
0000000000400430 l    d  .text  0000000000000000              .text
...
-----------------------------------------------------------------------------
objdump -T hello  

hello:     file format elf64-x86-64

DYNAMIC SYMBOL TABLE:
0000000000000000      DF *UND*  0000000000000000  GLIBC_2.2.5 printf
0000000000000000      DF *UND*  0000000000000000  GLIBC_2.2.5 __libc_start_main
0000000000000000  w   D  *UND*  0000000000000000              __gmon_start__

-----------------------------------------------------------------------------
strip hello
##############################################################################
objdump -t hello  

hello:     file format elf64-x86-64

SYMBOL TABLE:
no symbols
##############################################################################
 objdump -T hello           

hello:     file format elf64-x86-64

DYNAMIC SYMBOL TABLE:
0000000000000000      DF *UND*  0000000000000000  GLIBC_2.2.5 printf
0000000000000000      DF *UND*  0000000000000000  GLIBC_2.2.5 __libc_start_main
0000000000000000  w   D  *UND*  0000000000000000              __gmon_start__
-----------------------------------------------------------------------------
```

## ELF文件
* sandstone@localhost tec-sharing (feauture_wb_symbol_table) $ git commit -a -m "符号表的入门介绍@编译&链接"
* 组成： elf head | section heads | section 
* 分类：relocabtable executable shared
```
示例代码
const char* str_a = "testing-a";
const char* str_b = "testing-b";

int g_i = 30;
int g_j = 40;

int g_zero = 0;

int local_func(int x) {
    x = 30;
    int y = 40;
}

int printf(const char* format, ...);

int main() {

}
```
### elf head
```
typedef struct
{
  unsigned char e_ident[EI_NIDENT]; /* Magic number and other info */
  Elf64_Half    e_type;         /* Object file type */
  Elf64_Half    e_machine;      /* Architecture */
  Elf64_Word    e_version;      /* Object file version */
  Elf64_Addr    e_entry;        /* Entry point virtual address */
  Elf64_Off e_phoff;        /* Program header table file offset */
  Elf64_Off e_shoff;        /* Section header table file offset */
  Elf64_Word    e_flags;        /* Processor-specific flags */
  Elf64_Half    e_ehsize;       /* ELF header size in bytes */
  Elf64_Half    e_phentsize;        /* Program header table entry size */
  Elf64_Half    e_phnum;        /* Program header table entry count */
  Elf64_Half    e_shentsize;        /* Section header table entry size */
  Elf64_Half    e_shnum;        /* Section header table entry count */
  Elf64_Half    e_shstrndx;     /* Section header string table index */
} Elf64_Ehdr;
```
|  字段                              | 值 |                     介绍    |
|-------------------------------------|----------------------------------|-------------------------|
|   Magic                              | 7f454c46020101000000000000000000 |                         |
|   Class                             | ELF64                            |                         |
|   Data                              | 2'scomplement,littleendian       |                         |
|   Version                           | 1\(current\)                     |                         |
|   OS/ABI                            | UNIX\-SystemV                    |                         |
|   ABI Version                       | 0                                |                         |
|   Type                              | REL\(Relocatablefile\)           |                         |
|   Machine                           | AdvancedMicroDevicesX86\-64      |                         |
|   Version                           | 0x1                              |                         |
|   Entry point address               | 0x0                              | 程序入口地址，REL类型没有值，EXE类型有值 |
|   Start of program headers          | 0\(bytesintofile\)               |                         |
|   Start of section headers          | 912\(bytesintofile\)             |                         |
|   Flags                             | 0x0                              |                         |
|   Size of this header               | 64\(bytes\)                      |                         |
|   Size of program headers           | 0\(bytes\)                       |                         |
|   Number of program headers         | 0                                |                         |
|   Size of section headers           | 64\(bytes\)                      |                         |
|   Number of section headers         | 13                               | section的个数              |
|   Section header string table index | 12                               | 字符串表在section数组中的索引      |

###  section head 
* defintion
```
typedef struct
{
  Elf64_Word  sh_name;    /* Section name (string tbl index) */
  Elf64_Word  sh_type;    /* Section type */
  Elf64_Xword sh_flags;   /* Section flags */
  Elf64_Addr  sh_addr;    /* Section virtual addr at execution */
  Elf64_Off sh_offset;    /* Section file offset */
  Elf64_Xword sh_size;    /* Section size in bytes */
  Elf64_Word  sh_link;    /* Link to another section */
  Elf64_Word  sh_info;    /* Additional section information */
  Elf64_Xword sh_addralign;   /* Section alignment */
  Elf64_Xword sh_entsize;   /* Entry size if section holds table */
} Elf64_Shdr;
```
* view 

| 字段名        | 介绍                                             |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| \.data        | 保存初始化过的数据，这是普通程序数据的一部分，可以在程序运行期间修改。                                             |
| \.rodata      | 保存了只读数据，可以读取但不能修改，例如printf语句中的所有静态字符串封装到该节。       |
| \.init&\.fini | 保存了进程初始化和结束所用的代码，这通常是由编译器自动添加的。                |
| \.hash        | 一个散列表，允许在不对全表元素进行线性搜索的情况下，快速访问所有符号表项     |
| \.text        | 已编译程序的机器代码。           |
| \.rodata      | 只读数据，比如printf语句中的格式串和开关（switch）语句的跳转表。                         |
| \.data        | 已初始化的全局C变量。局部C变量在运行时被保存在栈中，既不出现在\.data中，也不出现在\.bss节中。              |
| \.bss         | 未初始化的全局C变量。在目标文件中这个节不占据实际的空间，它仅仅是一个占位符。目标文件格式区分初始化和未初始化变量是为了空间效率在              |
| \.symtab      | 一个符号表（symbol table），它存放在程序中被定义和引用的函数和全局变量的信息。一些程序员错误地认为必须通过\-g选项来编译一个程序，得到符号表信息。实际上，每个可重定位目标文件在\.symtab中都有一张符号表。然而，和编译器中的符号表不同，\.symtab符号表不包含局部变量的表目。 |
| \.rel\.text   | 当链接噐把这个目标文件和其他文件结合时，\.text节中的许多位置都需要修改。一般而言，任何调用外部函数或者引用全局变量的指令都需要修改。另一方面调用本地函数的指令则不需要修改。注意，可执行目标文件中并不需要重定位信息，因此通常省略，除非使用者显式地指示链接器包含这些信息。             |
| \.rel\.data   | 被模块定义或引用的任何全局变量的信息。一般而言，任何已初始化全局变量的初始值是全局变量或者外部定义函数的地址都需要被修改。       |
| \.debug       | 一个调试符号表，其有些表目是程序中定义的局部变量和类型定义，有些表目是程序中定义和引用的全局变量，有些是原始的C源文件。只有以\-g选项调用编译驱动程序时，才会得到这张表。       |
| \.line        | 原始C源程序中的行号和\.text节中机器指令之间的映射。只有以\-g选项调用编译驱动程序时，才会得到这张表。           |
| \.strtab      | 一个字符串表，其内容包括\.symtab和\.debug节中的符号表，以及节头部中的节名字。字符串表就是以null结尾的字符串序列。      |
| \.shstrtab      | 段表字符串表(Section Header String Table)，针对段表 |
| \.eh_frame      | The format of the .eh_frame section is similar in format and purpose to the .debug_frame section , and it shall contain 1 or more Call Frame Information (CFI) records. The number of records present shall be determined by size of the section as contained in the section header. Each CFI record contains a Common Information Entry (CIE) record followed by 1 or more Frame Description Entry (FDE) records. Both CIEs and FDEs shall be aligned to an addressing unit sized boundary. |

```
> readelf -S main.o / readelf -t main.o
There are 13 section headers, starting at offset 0x390:

Section Headers:
  [Nr] Name              Type             Address           Offset
       Size              EntSize          Flags  Link  Info  Align
  [ 0]                   NULL             0000000000000000  00000000
       0000000000000000  0000000000000000           0     0     0
  [ 1] .text             PROGBITS         0000000000000000  00000040
       000000000000001d  0000000000000000  AX       0     0     1
  [ 2] .data             PROGBITS         0000000000000000  00000060
       0000000000000018  0000000000000000  WA       0     0     8
  [ 3] .rela.data        RELA             0000000000000000  000002c8
       0000000000000030  0000000000000018   I      10     2     8
  [ 4] .bss              NOBITS           0000000000000000  00000078
       0000000000000004  0000000000000000  WA       0     0     4
  [ 5] .rodata           PROGBITS         0000000000000000  00000078
       0000000000000014  0000000000000000   A       0     0     1
  [ 6] .comment          PROGBITS         0000000000000000  0000008c
       000000000000002e  0000000000000001  MS       0     0     1
  [ 7] .note.GNU-stack   PROGBITS         0000000000000000  000000ba
       0000000000000000  0000000000000000           0     0     1
  [ 8] .eh_frame         PROGBITS         0000000000000000  000000c0
       0000000000000058  0000000000000000   A       0     0     8
  [ 9] .rela.eh_frame    RELA             0000000000000000  000002f8
       0000000000000030  0000000000000018   I      10     8     8
  [10] .symtab           SYMTAB           0000000000000000  00000118
       0000000000000180  0000000000000018          11     9     8
  [11] .strtab           STRTAB           0000000000000000  00000298
       000000000000002b  0000000000000000           0     0     1
  [12] .shstrtab         STRTAB           0000000000000000  00000328
       0000000000000061  0000000000000000           0     0     1
Key to Flags:
  W (write), A (alloc), X (execute), M (merge), S (strings), I (info),
  L (link order), O (extra OS processing required), G (group), T (TLS),
  C (compressed), x (unknown), o (OS specific), E (exclude),
  l (large), p (processor specific)
  -------------------------------------------------------------------------------------------

objdump -h main.o 

main.o:     file format elf64-x86-64

Sections:
Idx Name          Size      VMA               LMA               File off  Algn
  0 .text         0000001d  0000000000000000  0000000000000000  00000040  2**0
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
  1 .data         00000018  0000000000000000  0000000000000000  00000060  2**3
                  CONTENTS, ALLOC, LOAD, RELOC, DATA
  2 .bss          00000004  0000000000000000  0000000000000000  00000078  2**2
                  ALLOC
  3 .rodata       00000014  0000000000000000  0000000000000000  00000078  2**0
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  4 .comment      0000002e  0000000000000000  0000000000000000  0000008c  2**0
                  CONTENTS, READONLY
  5 .note.GNU-stack 00000000  0000000000000000  0000000000000000  000000ba  2**0
                  CONTENTS, READONLY
  6 .eh_frame     00000058  0000000000000000  0000000000000000  000000c0  2**3
                  CONTENTS, ALLOC, LOAD, RELOC, READONLY, DATA
```
### 查看符号表
```
> nm -C main.o 
0000000000000000 D a
0000000000000008 D b
0000000000000010 D g_i
0000000000000014 D g_j
0000000000000000 B g_zero
0000000000000000 T local_func
0000000000000017 T main
---------------------------------------------------------------------
> objdump -t main.o        

main.o:     file format elf64-x86-64

SYMBOL TABLE:
0000000000000000 l    df *ABS*  0000000000000000 main.c
0000000000000000 l    d  .text  0000000000000000 .text
0000000000000000 l    d  .data  0000000000000000 .data
0000000000000000 l    d  .bss   0000000000000000 .bss
0000000000000000 l    d  .rodata        0000000000000000 .rodata
0000000000000000 l    d  .debug_info    0000000000000000 .debug_info
0000000000000000 l    d  .debug_abbrev  0000000000000000 .debug_abbrev
0000000000000000 l    d  .debug_aranges 0000000000000000 .debug_aranges
0000000000000000 l    d  .debug_line    0000000000000000 .debug_line
0000000000000000 l    d  .debug_str     0000000000000000 .debug_str
0000000000000000 l    d  .note.GNU-stack        0000000000000000 .note.GNU-stack
0000000000000000 l    d  .eh_frame      0000000000000000 .eh_frame
0000000000000000 l    d  .comment       0000000000000000 .comment
0000000000000000 g     O .data  0000000000000008 a
0000000000000008 g     O .data  0000000000000008 b
0000000000000010 g     O .data  0000000000000004 g_i
0000000000000014 g     O .data  0000000000000004 g_j
0000000000000000 g     O .bss   0000000000000004 g_zero
0000000000000000 g     F .text  0000000000000017 local_func
0000000000000017 g     F .text  0000000000000006 main
```
对照代码，观察这些字段在elf中的位置
| 绝对地址(此处因为是object文件，没有绝对地址)  | 局部还是全局变量 | 类型 | 所处的段 | 段偏移  | 符号名           |
|----|---|---|--------|----|-------------|
| 0  | g | O | .data | 8  | a           |
| 8  | g | O | .data | 8  | b           |
| 10 | g | O | .data | 4  | g_i        |
| 14 | g | O | .data | 4  | g_j        |
| 0  | g | O | .bss  | 4  | g_zero     |
| 0  | g | F | .text | 17 | local_func |
| 17 | g | F | .text | 6  | main        |

### 查看指定的section
```
> readelf -x  .strtab  main.o   

Hex dump of section '.strtab': (可以看出，就是str的数组，存储代码中出现的符号)
  0x00000000 006d6169 6e2e6300 7374725f 61007374 .main.c.str_a.st
  0x00000010 725f6200 675f6900 675f6a00 675f7a65 r_b.g_i.g_j.g_ze
  0x00000020 726f006c 6f63616c 5f66756e 63006d61 ro.local_func.ma
  0x00000030 696e00                              in
------------------------------------------------------------------------------
> readelf -x  .shstrtab  main.o           

Hex dump of section '.shstrtab':c (也是数组，存储段名字符串)
  0x00000000 002e7379 6d746162 002e7374 72746162 ..symtab..strtab
  0x00000010 002e7368 73747274 6162002e 74657874 ..shstrtab..text
  0x00000020 002e7265 6c612e64 61746100 2e627373 ..rela.data..bss
  0x00000030 002e726f 64617461 002e7265 6c612e64 ..rodata..rela.d
  0x00000040 65627567 5f696e66 6f002e64 65627567 ebug_info..debug
  0x00000050 5f616262 72657600 2e72656c 612e6465 _abbrev..rela.de
  0x00000060 6275675f 6172616e 67657300 2e72656c bug_aranges..rel
  0x00000070 612e6465 6275675f 6c696e65 002e6465 a.debug_line..de
  0x00000080 6275675f 73747200 2e636f6d 6d656e74 bug_str..comment
  0x00000090 002e6e6f 74652e47 4e552d73 7461636b ..note.GNU-stack
  0x000000a0 002e7265 6c612e65 685f6672 616d6500 ..rela.eh_frame.
-----------------------------------------------------------------------------
> readelf -x  .rodata  main.o         

Hex dump of section '.rodata':
  0x00000000 74657374 696e672d 61007465 7374696e testing-a.testin
  0x00000010 672d6200                            g-b.
```

### 反编译
```
> objdump -d main.o    

main.o:     file format elf64-x86-64

Disassembly of section .text:

0000000000000000 <local_func>:
   0:   55                      push   %rbp
   1:   48 89 e5                mov    %rsp,%rbp
   4:   89 7d ec                mov    %edi,-0x14(%rbp)
   7:   c7 45 fc 1e 00 00 00    movl   $0x1e,-0x4(%rbp)
   e:   c7 45 f8 28 00 00 00    movl   $0x28,-0x8(%rbp)
  15:   5d                      pop    %rbp
  16:   c3                      retq   

0000000000000017 <main>:
  17:   55                      push   %rbp
  18:   48 89 e5                mov    %rsp,%rbp
  1b:   5d                      pop    %rbp
  1c:   c3                      retq   
```
## abount tools 
* nm 专业显示符号表
* objdump 使用[BFD](##BFD)的视角查看文件，另外查看汇编模式也使用
* readelf 最全面的数据查看方式

## BFD
* 当Cygnus Solutions公司的David Henkel-Wallace提议开发这样一个库来为公司创造新的商业机遇时，Richard Stallman说这会是一件困难的事情；而David的回复是" it wasn't such a 'Big F*cking Deal'（没什么大不了的）"。这句话的英文缩写BFD便成为了这个库的名称[1]，而“Binary File Descriptor（二进制文件描述）”则是在BFD缩写的基础上发明的。
* BFD通过对目标文件提供公共抽象视图来达成工作。一个目标文件有带有描述信息的一个“头”；可变量目的“段”，每个段都有一个名字、一些属性和一块数据；一个符号表；一组重定位入口项；诸如此类。

## object code
* 计算机科学中编译器或汇编器处理源代码后所生成的代码，它一般由机器代码或接近于机器语言的代码组成
* 目标文件是从源代码文件产生程序文件这一过程的中间产物，链接器正是通过把目标文件链接在一起来生成可执行文件或库文件。


## ABI (application binary interface)
* 应用二进制接口
* x86的调用约定即是一个ABI的例子


## 符号的强弱
* 函数和初始化的全局变量（包括显示初始化为0）是强符号，未初始化的全局变量是弱符号

* 三条规则适用
```
同名的强符号只能有一个，否则编译器报"重复定义"错误。

允许一个强符号和多个弱符号，但定义会选择强符号的。

当有多个弱符号相同时，链接器选择最先出现那个，也就是与链接顺序有关。
```
* 查看，g_i变量(COM表示弱符号)
```
#include <stdio.h>
int g_i;
extern int extern_var;
int print(int x) {
    extern_var = 40;
}
----------------------------------------------------------------------------------------
> objdump -t simple_print.o 

simple_print.o:     file format elf64-x86-64

SYMBOL TABLE:
0000000000000000 l    df *ABS*  0000000000000000 simple_print.c
0000000000000000 l    d  .text  0000000000000000 .text
0000000000000000 l    d  .data  0000000000000000 .data
0000000000000000 l    d  .bss   0000000000000000 .bss
0000000000000000 l    d  .note.GNU-stack        0000000000000000 .note.GNU-stack
0000000000000000 l    d  .eh_frame      0000000000000000 .eh_frame
0000000000000000 l    d  .comment       0000000000000000 .comment
0000000000000004       O *COM*  0000000000000004 g_i
0000000000000000 g     F .text  0000000000000013 print
0000000000000000         *UND*  0000000000000000 extern_var
```

## 调试信息
* 调试信息一般都是按照什么样的格式存放的呢？主要有下面几种：stabs，COFF，PE-COFF，OMF，IEEE-695和DWARF。其中DWARF在Linux中被普遍使用
* DWARF: Debugging With Attributed Record Formats
* 查看
```
gcc -c -g main.c -o main.o
 readelf -wl main.o
 Raw dump of debug contents of section .debug_line:

  Offset:                      0x0
  Length:                      59
  DWARF Version:               2
  Prologue Length:             29
  Minimum Instruction Length:  1
  Initial value of 'is_stmt':  1
  Line Base:                   -5
  Line Range:                  14
  Opcode Base:                 13

 Opcodes:
  Opcode 1 has 0 args
  Opcode 2 has 1 args
  Opcode 3 has 1 args
  Opcode 4 has 1 args
  Opcode 5 has 1 args
  Opcode 6 has 0 args
  Opcode 7 has 0 args
  Opcode 8 has 0 args
  Opcode 9 has 1 args
  Opcode 10 has 0 args
  Opcode 11 has 0 args
  Opcode 12 has 1 args

 The Directory Table is empty.

 The File Name Table (offset 0x1c):
  Entry Dir     Time    Size    Name
  1     0       0       0       main.c

 Line Number Statements:
  [0x00000027]  Extended opcode 2: set Address to 0x0
  [0x00000032]  Advance Line by 9 to 10
  [0x00000034]  Copy
  [0x00000035]  Special opcode 104: advance Address by 7 to 0x7 and Line by 1 to 11
  [0x00000036]  Special opcode 104: advance Address by 7 to 0xe and Line by 1 to 12
  [0x00000037]  Special opcode 104: advance Address by 7 to 0x15 and Line by 1 to 13
  [0x00000038]  Special opcode 38: advance Address by 2 to 0x17 and Line by 5 to 18
  [0x00000039]  Special opcode 65: advance Address by 4 to 0x1b and Line by 4 to 22
  [0x0000003a]  Advance PC by 2 to 0x1d
  [0x0000003c]  Extended opcode 1: End of Sequence
  ----------------------------------------------------------------------------------------
  readelf -wi main.o        
Contents of the .debug_info section:

  Compilation Unit @ offset 0x0:
   Length:        0xff (32-bit)
   Version:       4
   Abbrev Offset: 0x0
   Pointer Size:  8
 <0><b>: Abbrev Number: 1 (DW_TAG_compile_unit)
    <c>   DW_AT_producer    : (indirect string, offset: 0x7): GNU C 4.8.5 20150623 (Red Hat 4.8.5-36) -mtune=generic -march=x86-64 -g
    <10>   DW_AT_language    : 1        (ANSI C)
    <11>   DW_AT_name        : (indirect string, offset: 0x0): main.c
    <15>   DW_AT_comp_dir    : (indirect string, offset: 0x6b): /home/sandstone/workpath/github/Colosseum/compile/elf
    <19>   DW_AT_low_pc      : 0x0
    <21>   DW_AT_high_pc     : 0x1d
    <29>   DW_AT_stmt_list   : 0x0
 <1><2d>: Abbrev Number: 2 (DW_TAG_subprogram)
    <2e>   DW_AT_external    : 1
    <2e>   DW_AT_name        : (indirect string, offset: 0x5b): local_func
    <32>   DW_AT_decl_file   : 1
    <33>   DW_AT_decl_line   : 10
    <34>   DW_AT_prototyped  : 1
    <34>   DW_AT_type        : <0x67>
    <38>   DW_AT_low_pc      : 0x0
    <40>   DW_AT_high_pc     : 0x17
    <48>   DW_AT_frame_base  : 1 byte block: 9c         (DW_OP_call_frame_cfa)
    <4a>   DW_AT_GNU_all_call_sites: 1
    <4a>   DW_AT_sibling     : <0x67>
 <2><4e>: Abbrev Number: 3 (DW_TAG_formal_parameter)
    <4f>   DW_AT_name        : x
    <51>   DW_AT_decl_file   : 1
    <52>   DW_AT_decl_line   : 10
    <53>   DW_AT_type        : <0x67>
    <57>   DW_AT_location    : 2 byte block: 91 5c      (DW_OP_fbreg: -36)
 <2><5a>: Abbrev Number: 4 (DW_TAG_variable)
    <5b>   DW_AT_name        : y
    <5d>   DW_AT_decl_file   : 1
    <5e>   DW_AT_decl_line   : 12
    <5f>   DW_AT_type        : <0x67>
    <63>   DW_AT_location    : 2 byte block: 91 68      (DW_OP_fbreg: -24)
 <2><66>: Abbrev Number: 0
 <1><67>: Abbrev Number: 5 (DW_TAG_base_type)
    <68>   DW_AT_byte_size   : 4
    <69>   DW_AT_encoding    : 5        (signed)
    <6a>   DW_AT_name        : int
 <1><6e>: Abbrev Number: 6 (DW_TAG_subprogram)
    <6f>   DW_AT_external    : 1
    <6f>   DW_AT_name        : (indirect string, offset: 0x4f): main
    <73>   DW_AT_decl_file   : 1
    <74>   DW_AT_decl_line   : 18
    <75>   DW_AT_type        : <0x67>
    <79>   DW_AT_low_pc      : 0x17
    <81>   DW_AT_high_pc     : 0x6
    <89>   DW_AT_frame_base  : 1 byte block: 9c         (DW_OP_call_frame_cfa)
    <8b>   DW_AT_GNU_all_call_sites: 1
 <1><8b>: Abbrev Number: 7 (DW_TAG_variable)
    <8c>   DW_AT_name        : a
    <8e>   DW_AT_decl_file   : 1
    <8f>   DW_AT_decl_line   : 2
    <90>   DW_AT_type        : <0x9e>
    <94>   DW_AT_external    : 1
    <94>   DW_AT_location    : 9 byte block: 3 0 0 0 0 0 0 0 0  (DW_OP_addr: 0)
 <1><9e>: Abbrev Number: 8 (DW_TAG_pointer_type)
    <9f>   DW_AT_byte_size   : 8
    <a0>   DW_AT_type        : <0xa4>
 <1><a4>: Abbrev Number: 9 (DW_TAG_const_type)
    <a5>   DW_AT_type        : <0xa9>
 <1><a9>: Abbrev Number: 10 (DW_TAG_base_type)
    <aa>   DW_AT_byte_size   : 1
    <ab>   DW_AT_encoding    : 6        (signed char)
    <ac>   DW_AT_name        : (indirect string, offset: 0x66): char
 <1><b0>: Abbrev Number: 7 (DW_TAG_variable)
    <b1>   DW_AT_name        : b
    <b3>   DW_AT_decl_file   : 1
    <b4>   DW_AT_decl_line   : 3
    <b5>   DW_AT_type        : <0x9e>
    <b9>   DW_AT_external    : 1
    <b9>   DW_AT_location    : 9 byte block: 3 8 0 0 0 0 0 0 0  (DW_OP_addr: 8)
 <1><c3>: Abbrev Number: 7 (DW_TAG_variable)
    <c4>   DW_AT_name        : g_i
    <c8>   DW_AT_decl_file   : 1
    <c9>   DW_AT_decl_line   : 5
    <ca>   DW_AT_type        : <0x67>
    <ce>   DW_AT_external    : 1
    <ce>   DW_AT_location    : 9 byte block: 3 10 0 0 0 0 0 0 0         (DW_OP_addr: 10)
 <1><d8>: Abbrev Number: 7 (DW_TAG_variable)
    <d9>   DW_AT_name        : g_j
    <dd>   DW_AT_decl_file   : 1
    <de>   DW_AT_decl_line   : 6
    <df>   DW_AT_type        : <0x67>
    <e3>   DW_AT_external    : 1
    <e3>   DW_AT_location    : 9 byte block: 3 14 0 0 0 0 0 0 0         (DW_OP_addr: 14)
 <1><ed>: Abbrev Number: 11 (DW_TAG_variable)
    <ee>   DW_AT_name        : (indirect string, offset: 0x54): g_zero
    <f2>   DW_AT_decl_file   : 1
    <f3>   DW_AT_decl_line   : 8
    <f4>   DW_AT_type        : <0x67>
    <f8>   DW_AT_external    : 1
    <f8>   DW_AT_location    : 9 byte block: 3 0 0 0 0 0 0 0 0  (DW_OP_addr: 0)
 <1><102>: Abbrev Number: 0
```