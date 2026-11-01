# mac-native — Swift 네이티브 바이너리 RE 연습장

영상(코딩애플 "리버스 엔지니어링으로 대환장파티중")에 나온 **컴파일된 바이너리 뜯기**를,
웹/Electron이 아닌 **진짜 네이티브 Mach-O**로 연습하기 위한 자작 crackme입니다.
내가 소스를 가지고 있으니 디스어셈블 결과를 정답과 대조할 수 있습니다.

> ⚠️ 이건 **내 소유 바이너리**로 하는 학습용입니다. 남의 앱의 라이선스/DRM 우회·크랙·배포는
> 저작권·ToS 위반이니 하지 마세요.

## 빌드 & 실행

```bash
swiftc crackme.swift -o lanimepass        # arm64 Mach-O 생성
./lanimepass                              # 사용법
./lanimepass LANI-WRONGKEY                # ❌ Invalid license key. (exit 1)
./lanimepass LANI-LANIME25                # ✅ Access granted       (exit 0)
```

## 설계 (RE 포인트)

- `LANI-` 프리픽스 + 8글자 본문 형식의 라이선스 키
- 정답 키는 **평문으로 저장하지 않고 djb2 해시만** 바이너리에 박아둠
  → `strings`로는 정답이 안 샘 → **컴파일된 로직을 읽어야** 함
- 매직 상수: 본문 해시가 `0xE60EAD02`와 같아야 통과

## RE 워크스루 (CLT 기본 도구만 사용)

```bash
# 1) 문자열 — 프롬프트/프리픽스는 새지만 정답 키는 안 보인다 (해시라서)
strings -a lanimepass | grep -iE "LANI|granted|premium"

# 2) 심볼 — 체크 함수 위치 (Swift 네임 맹글링됨)
nm lanimepass | grep -iE "isValidKey|keyHash"
#   _$s10lanimepass10isValidKeyySbSSF   ← isValidKey
#   _$s10lanimepass7keyHashys6UInt32VSsF ← keyHash

# 3) 디스어셈블 — 매직 상수가 arm64에서 하위/상위 16비트로 나뉘어 적재된다
otool -tV lanimepass | grep -iE "#0x(ad02|e60e)"
#   mov  w9, #0xad02
#   movk w9, #0xe60e, lsl #16      → 합치면 0xE60EAD02
```

즉 **문자열 → 심볼 → 어셈블리**로 내려가며 "비교 상수"와 "해시 루프(`mul w8,w8,w10` = ×33)"를
눈으로 확인하는 게 핵심 흐름입니다.

## 크랙 두 가지 접근 (고전)

1. **Keygen** — 해시 알고리즘(djb2, seed `0x1505`, ×33)과 타깃 상수를 이해해 통과하는 키를 "생성"
2. **Patch** — 비교/분기 명령(`cmp` 뒤의 조건 분기)을 뒤집어 **아무 키나 통과**하게 바이너리를 수정

## 더 편한 도구로 확장 (선택)

```bash
brew install radare2      # r2 -A lanimepass; afl; pdf @ sym...isValidKey
```
- **radare2 / rizin** — 무료 CLI 역분석(그래프, 패치)
- **Ghidra** — 무료 GUI 디컴파일러(의사 C 코드로 복원)
- **Hopper** — 맥 네이티브 인기 디스어셈블러

<details>
<summary>정답 키 (스포일러)</summary>

`LANI-LANIME25`  (본문 `LANIME25`의 djb2 해시 = `0xE60EAD02`)

</details>
