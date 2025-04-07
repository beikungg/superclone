"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    ThemeProvider,
    createTheme
} from '@mui/material/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Stack,
    Alert,
    Snackbar
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Search as SearchIcon,
    Upload as UploadIcon,
    PlayArrow as PlayArrowIcon,
    Stop as StopIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import styles from './VoiceCloneWindow.module.css';
import { useTheme } from 'next-themes';

interface FileItem {
    uid: string;
    name: string;
    status: string;
    url: string;
    sourceVoice?: string;
    convertedVoice?: string;
    targetVoice?: string;
}

interface VoiceItem {
    personid: number;
    personName: string;
    personSex: string;
    personIntroduction: string;
    personVoiceUrl: string;
    loaded: boolean;
}

type DataIndex = keyof FileItem;

const VoiceCloneWindow: React.FC = () => {
    const { theme: nextTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [fileList, setFileList] = useState<FileItem[]>([]);
    const [searchText, setSearchText] = useState('');
    const [filteredFileList, setFilteredFileList] = useState<FileItem[]>([]);
    const searchInput = useRef<HTMLInputElement>(null);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [tipsLoading, setTipsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [voiceList, setVoiceList] = useState<VoiceItem[]>([
        {
            personid: 0,
            personName: "干净男声",
            personSex: "男",
            personIntroduction: "中青年 温和 成熟 温暖",
            personVoiceUrl: "/voices/pengfei/pxp2_540.wav",
            loaded: true,
        },
        {
            personid: 1,
            personName: "干净女声",
            personSex: "女",
            personIntroduction: "青少年 认真 朝气 谨慎",
            personVoiceUrl: "/voices/xiaoqingnv/default.wav",
            loaded: true,
        },
        {
            personid: 2,
            personName: "TomZZP",
            personSex: "男",
            personIntroduction: "青年 中低音 微磁性 平实",
            personVoiceUrl: "/voices/zzp/default.wav",
            loaded: true,
        }
    ]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 根据主题返回对应的样式
    const getThemeStyles = () => {
        const isDark = resolvedTheme === 'dark';
        return {
            background: isDark ? 'hsl(var(--background))' : '#ffffff',
            text: isDark ? 'hsl(var(--foreground))' : '#000000',
            paper: isDark ? 'hsl(var(--card))' : '#ffffff',
            border: isDark ? 'hsl(var(--border))' : '#e5e7eb',
            gradientText: isDark 
                ? 'linear-gradient(45deg, #7928CA, #FF0080)'
                : 'linear-gradient(45deg, #2563eb, #3b82f6)'
        };
    };

    const themeStyles = getThemeStyles();

    // 创建 MUI 主题
    const muiTheme = createTheme({
        palette: {
            mode: resolvedTheme === 'dark' ? 'dark' : 'light',
            background: {
                default: themeStyles.background,
                paper: themeStyles.paper,
            },
            text: {
                primary: themeStyles.text,
            },
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeStyles.paper,
                        color: themeStyles.text,
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderColor: themeStyles.border,
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        color: themeStyles.text,
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        backgroundColor: themeStyles.paper,
                        color: themeStyles.text,
                    },
                },
            },
        },
    });

    if (!mounted) {
        return null;
    }

    // 搜索功能
    const handleSearch = () => {
        if (!searchText) {
            setFilteredFileList(fileList);
            return;
        }
        const filtered = fileList.filter(file =>
            file.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredFileList(filtered);
    };

    // 文件上传
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('audio/')) {
                showSnackbar(`${file.name} 不是音频文件`, 'error');
                return;
            }

            const url = URL.createObjectURL(file);
            const uid = `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const newFile = {
                uid,
                name: file.name,
                status: 'done',
                url: url,
            };

            setFileList(prev => [...prev, newFile]);
            setFilteredFileList(prev => [...prev, newFile]);
        });
    };

    // 批量删除
    const handleBatchDelete = () => {
        if (selectedRows.length === 0) {
            showSnackbar('请先选择要删除的文件', 'warning');
            return;
        }
        setOpenDialog(true);
    };

    // 确认删除
    const confirmDelete = () => {
        const newFileList = fileList.filter(item => !selectedRows.includes(item.uid));
        setFileList(newFileList);
        setFilteredFileList(newFileList);
        setSelectedRows([]);
        showSnackbar(`成功删除 ${selectedRows.length} 个文件`, 'success');
        setOpenDialog(false);
    };

    // 清空列表
    const handleClearAll = () => {
        if (fileList.length === 0) {
            showSnackbar('列表已经为空', 'warning');
            return;
        }
        setOpenDialog(true);
    };

    // 单个删除
    const handleDelete = (uid: string) => {
        const newFileList = fileList.filter(item => item.uid !== uid);
        setFileList(newFileList);
        setFilteredFileList(newFileList);
        showSnackbar('删除成功', 'success');
    };

    // 播放音频
    const handlePlay = (url: string) => {
        if (currentPlaying === url) {
            audioRef.current?.pause();
            setCurrentPlaying(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
                setCurrentPlaying(url);
            }
        }
    };

    // 显示提示信息
    const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning') => {
        setSnackbar({ open: true, message, severity });
    };

    // 表格列配置
    const columns = [
        {
            id: 'name',
            label: '资源名称',
            minWidth: 170
        },
        {
            id: 'sourceVoice',
            label: '原音试听',
            minWidth: 100,
            render: (row: FileItem) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton
                        size="small"
                        onClick={() => handlePlay(row.url)}
                        color={currentPlaying === row.url ? 'primary' : 'default'}
                    >
                        {currentPlaying === row.url ? <StopIcon /> : <PlayArrowIcon />}
                    </IconButton>
                </Stack>
            )
        },
        {
            id: 'targetVoice',
            label: '目标音色',
            minWidth: 200,
            render: (row: FileItem) => (
                <Stack direction="row" spacing={1} alignItems="center" className={styles.voiceInfo}>
                    <span className={styles.voiceName}>
                        {row.targetVoice ? getVoiceName(row.targetVoice) : '未选择'}
                    </span>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => showVoiceModal(row)}
                    >
                        {row.targetVoice ? '更换音色' : '选择音色'}
                    </Button>
                </Stack>
            )
        },
        {
            id: 'convert',
            label: '一键转换',
            minWidth: 100,
            render: (row: FileItem) => (
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleConvert(row)}
                    disabled={!row.targetVoice}
                    color={row.targetVoice ? 'primary' : 'inherit'}
                >
                    转换
                </Button>
            )
        },
        {
            id: 'convertedVoice',
            label: '转换结果',
            minWidth: 200,
            render: (row: FileItem) => (
                row.convertedVoice ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton
                            size="small"
                            onClick={() => handlePlay(row.convertedVoice!)}
                            color={currentPlaying === row.convertedVoice ? 'primary' : 'default'}
                        >
                            {currentPlaying === row.convertedVoice ? <StopIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleDownload(row)}
                        >
                            下载
                        </Button>
                    </Stack>
                ) : (
                    <span className={styles.voiceLabel}>
                        {row.targetVoice ? '等待转换' : '请先选择音色'}
                    </span>
                )
            )
        },
        {
            id: 'actions',
            label: '操作',
            minWidth: 80,
            render: (row: FileItem) => (
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(row.uid)}
                >
                    <DeleteIcon />
                </IconButton>
            )
        }
    ];

    // 处理转换
    const handleConvert = (file: FileItem) => {
        if (!file.targetVoice) {
            showSnackbar('请先选择目标音色', 'warning');
            return;
        }
        // TODO: 实现转换逻辑
        showSnackbar('转换功能待实现', 'warning');
    };

    // 处理下载
    const handleDownload = (file: FileItem) => {
        if (!file.convertedVoice) {
            showSnackbar('没有可下载的转换结果', 'warning');
            return;
        }
        // TODO: 实现下载逻辑
        showSnackbar('下载功能待实现', 'warning');
    };

    // 批量转换
    const handleBatchConvert = () => {
        const selectedFiles = fileList.filter(file => selectedRows.includes(file.uid));
        const hasNoTarget = selectedFiles.some(file => !file.targetVoice);
        if (hasNoTarget) {
            showSnackbar('请先为所有选中文件选择目标音色', 'warning');
            return;
        }
        // TODO: 实现批量转换逻辑
        showSnackbar('批量转换功能待实现', 'warning');
    };

    // 批量下载
    const handleBatchDownload = () => {
        const selectedFiles = fileList.filter(file => selectedRows.includes(file.uid));
        const hasNoConverted = selectedFiles.some(file => !file.convertedVoice);
        if (hasNoConverted) {
            showSnackbar('部分文件尚未转换', 'warning');
            return;
        }
        // TODO: 实现批量下载逻辑
        showSnackbar('批量下载功能待实现', 'warning');
    };

    // 批量选择音色
    const showBatchVoiceModal = () => {
        setModalVisible1(true);
    };

    // 选择音色
    const selectVoice = (voice: VoiceItem) => {
        if (selectedFile) {
            const newFileList = fileList.map(item => {
                if (item.uid === selectedFile.uid) {
                    return {
                        ...item,
                        targetVoice: voice.personid.toString()
                    };
                }
                return item;
            });
            setFileList(newFileList);
            setFilteredFileList(newFileList);
            setModalVisible(false);
            setSelectedFile(null);
            showSnackbar(`已选择音色：${voice.personName}`, 'success');
        }
    };

    // 批量选择音色确认
    const selectBatchVoice = (voice: VoiceItem) => {
        const newFileList = fileList.map(item => {
            if (selectedRows.includes(item.uid)) {
                return {
                    ...item,
                    targetVoice: voice.personid.toString()
                };
            }
            return item;
        });
        setFileList(newFileList);
        setFilteredFileList(newFileList);
        setModalVisible1(false);
        showSnackbar(`已为 ${selectedRows.length} 个文件设置音色：${voice.personName}`, 'success');
    };

    // 音色选择弹窗内容
    const renderVoiceModalContent = (isBatch: boolean = false) => (
        <Box sx={{
            width: '100%',
            overflowX: 'auto',
            '& .MuiTableCell-root': {
                padding: { xs: '8px', sm: '16px' },
                whiteSpace: 'nowrap'
            }
        }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>音色名称</TableCell>
                        <TableCell>性别</TableCell>
                        <TableCell>音色介绍</TableCell>
                        <TableCell>试听</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {voiceList.map((voice) => (
                        <TableRow
                            key={voice.personid}
                            hover
                            sx={{
                                '& .MuiTableCell-root': {
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                }
                            }}
                        >
                            <TableCell>{voice.personName}</TableCell>
                            <TableCell>{voice.personSex}</TableCell>
                            <TableCell sx={{ maxWidth: { xs: '120px', sm: '200px' }, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {voice.personIntroduction}
                            </TableCell>
                            <TableCell>
                                <audio
                                    controls
                                    style={{
                                        height: '40px',
                                        maxWidth: '150px'
                                    }}
                                >
                                    <source src={voice.personVoiceUrl} type="audio/wav" />
                                </audio>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => isBatch ? selectBatchVoice(voice) : selectVoice(voice)}
                                    sx={{
                                        minWidth: { xs: '60px', sm: '80px' },
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                    }}
                                >
                                    选择
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );

    // 显示提示
    const showTips = () => {
        setTipsLoading(true);
    };

    // 显示音色选择弹窗
    const showVoiceModal = (file: FileItem) => {
        setSelectedFile(file);
        setModalVisible(true);
    };

    // 显示音色名称
    const getVoiceName = (voiceId: string) => {
        const voice = voiceList.find(v => v.personid.toString() === voiceId);
        return voice ? voice.personName : '-';
    };

    return (
        <ThemeProvider theme={muiTheme}>
            <div className={`${styles.card} ${resolvedTheme === 'dark' ? 'dark' : ''}`} 
                style={{ 
                    backgroundColor: themeStyles.background,
                    color: themeStyles.text,
                    borderColor: themeStyles.border
                }}>
                <Typography variant="h1" className={styles.title} style={{
                    background: themeStyles.gradientText,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    SUPERCLONE
                </Typography>
                <Typography variant="h2" className={styles.subtitle}>
                    上传音频文件，选择目标声音，一键转换
                </Typography>

                {/* 上传区域 */}
                <Box className={styles.upload}>
                    <input
                        type="file"
                        multiple
                        accept="audio/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        id="file-upload"
                    />
                    <label htmlFor="file-upload">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<UploadIcon />}
                            sx={{ mb: 2, fontSize: '1.1rem', padding: '10px 24px' }}
                        >
                            点击或拖拽上传音频文件
                        </Button>
                    </label>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        支持的格式：WAV, MP3, AAC, OGG
                    </Typography>
                </Box>

                {/* 搜索和操作按钮 */}
                <Box className={styles.searchAndActions}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: { xs: 'nowrap', md: 'wrap' } }}>
                        <TextField
                            size="small"
                            placeholder="搜索文件..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton size="small" onClick={handleSearch}>
                                        <SearchIcon />
                                    </IconButton>
                                ),
                            }}
                            sx={{ minWidth: '200px' }}
                        />
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleBatchDelete}
                            disabled={selectedRows.length === 0}
                        >
                            批量删除
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={showBatchVoiceModal}
                            disabled={selectedRows.length === 0}
                        >
                            批量选择
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleBatchConvert}
                            disabled={selectedRows.length === 0}
                        >
                            批量转换
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleBatchDownload}
                            disabled={selectedRows.length === 0}
                        >
                            批量下载
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<ClearIcon />}
                            onClick={handleClearAll}
                        >
                            清空列表
                        </Button>
                        <Button
                            variant="text"
                            onClick={showTips}
                        >
                            使用说明
                        </Button>
                    </Stack>
                </Box>

                {/* 文件列表表格 */}
                <TableContainer component={Paper} className={styles.tableContainer}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length > 0 && selectedRows.length === fileList.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedRows(fileList.map(item => item.uid));
                                            } else {
                                                setSelectedRows([]);
                                            }
                                        }}
                                    />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(filteredFileList.length > 0 ? filteredFileList : fileList).map((row) => (
                                <TableRow
                                    hover
                                    key={row.uid}
                                    selected={selectedRows.includes(row.uid)}
                                >
                                    <TableCell padding="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(row.uid)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRows([...selectedRows, row.uid]);
                                                } else {
                                                    setSelectedRows(selectedRows.filter(id => id !== row.uid));
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    {columns.map((column) => (
                                        <TableCell key={column.id}>
                                            {column.render ? column.render(row) : row[column.id as keyof FileItem]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* 确认对话框 */}
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                >
                    <DialogTitle>
                        确认删除
                    </DialogTitle>
                    <DialogContent>
                        确定要删除选中的文件吗？此操作不可撤销。
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>取消</Button>
                        <Button onClick={confirmDelete} color="error">确认</Button>
                    </DialogActions>
                </Dialog>

                {/* 提示消息 */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert severity={snackbar.severity as 'success' | 'error' | 'warning'}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>

                {/* 音频播放器 */}
                <audio ref={audioRef} onEnded={() => setCurrentPlaying(null)} />

                {/* 音色选择弹窗 */}
                <Dialog
                    open={modalVisible}
                    onClose={() => {
                        setModalVisible(false);
                        setSelectedFile(null);
                    }}
                    maxWidth="md"
                    fullWidth
                    sx={{
                        '& .MuiDialog-paper': {
                            width: '95%',
                            margin: { xs: '16px', sm: '32px' }
                        }
                    }}
                >
                    <DialogTitle sx={{
                        borderBottom: '1px solid #eee',
                        pb: 2,
                        fontSize: { xs: '1.2rem', sm: '1.5rem' }
                    }}>
                        <Typography variant="h6" component="div">
                            选择目标音色
                        </Typography>
                        {selectedFile && (
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                当前文件：{selectedFile.name}
                            </Typography>
                        )}
                    </DialogTitle>
                    <DialogContent sx={{
                        mt: 2,
                        p: { xs: 1, sm: 2 },
                        minHeight: { xs: '300px', sm: '400px' }
                    }}>
                        {renderVoiceModalContent(false)}
                    </DialogContent>
                    <DialogActions sx={{
                        borderTop: '1px solid #eee',
                        pt: 2,
                        px: { xs: 2, sm: 3 }
                    }}>
                        <Button onClick={() => {
                            setModalVisible(false);
                            setSelectedFile(null);
                        }}>
                            关闭
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* 批量音色选择弹窗 */}
                <Dialog
                    open={modalVisible1}
                    onClose={() => setModalVisible1(false)}
                    maxWidth="md"
                    fullWidth
                    sx={{
                        '& .MuiDialog-paper': {
                            width: '95%',
                            margin: { xs: '16px', sm: '32px' }
                        }
                    }}
                >
                    <DialogTitle sx={{
                        borderBottom: '1px solid #eee',
                        pb: 2,
                        fontSize: { xs: '1.2rem', sm: '1.5rem' }
                    }}>
                        <Typography variant="h6" component="div">
                            批量选择目标音色
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            已选择 {selectedRows.length} 个文件
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{
                        mt: 2,
                        p: { xs: 1, sm: 2 },
                        minHeight: { xs: '300px', sm: '400px' }
                    }}>
                        {renderVoiceModalContent(true)}
                    </DialogContent>
                    <DialogActions sx={{
                        borderTop: '1px solid #eee',
                        pt: 2,
                        px: { xs: 2, sm: 3 }
                    }}>
                        <Button onClick={() => setModalVisible1(false)}>
                            关闭
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* 提示弹窗 */}
                <Dialog
                    open={tipsLoading}
                    onClose={() => setTipsLoading(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        <Typography variant="h6" component="div">
                            使用说明
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <div className={styles.tips}>
                            <div className={styles.tipItem}>
                                1、音频转换中间有文件传输过程，为保证转换速度，请尽量不要传输过大文件(建议10mb以内) ૮₍ •̥𖥦•̥ ♡ ₎ა
                            </div>
                            <div className={styles.tipItem}>
                                2、长音频推理时有音频切片过程，为保证转换速度，请尽量不要传输过长文件(建议60s以内,越短越快) ૮⌯'ㅅ'⌯ ა
                            </div>
                            <div className={styles.tipItem}>
                                3、音频转换中间有文件传输过程，为保证转换速度，建议您在良好的网络连接速度下转换(避免使用代理) ⊂₍ •ᴥ• ₎っ
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setTipsLoading(false)}>我知道了</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </ThemeProvider>
    );
};

export default VoiceCloneWindow; 