@echo off
chcp 65001 >nul
title Hece Parki - Sunucu
rem Mikrofon ve tutarli yerel kayit icin yerel sunucu
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0sunucu.ps1" -TarayiciAc
if errorlevel 1 pause
