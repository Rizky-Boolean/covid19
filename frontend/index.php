<?php
include './connection.php';

// Data Indonesia
$query_indonesia = "SELECT 
                    SUM(r.confirmed) as total_confirmed,
                    SUM(r.recovered) as total_recovered,
                    SUM(r.deaths) as total_deaths,
                    SUM(r.confirmed_diff) as today_confirmed,
                    SUM(r.recovered_diff) as today_recovered,
                    SUM(r.deaths_diff) as today_deaths,
                    AVG(r.fatality_rate) as fatality_rate
                  FROM reports r
                  JOIN reports_region rr ON r.reports_id = rr.reports_id
                  WHERE rr.iso = 'IDN'";
$result_indonesia = $conn->query($query_indonesia);
$indonesiaData = $result_indonesia->fetch_assoc();

// Data Global
$query_global = "SELECT 
                SUM(r.confirmed) as total_confirmed,
                SUM(r.recovered) as total_recovered,
                SUM(r.deaths) as total_deaths,
                SUM(r.confirmed_diff) as today_confirmed,
                SUM(r.recovered_diff) as today_recovered,
                SUM(r.deaths_diff) as today_deaths,
                AVG(r.fatality_rate) as fatality_rate
              FROM reports r";
$result_global = $conn->query($query_global);
$globalData = $result_global->fetch_assoc();

// Timeline Indonesia (30 hari terakhir)
$endDate = '2020-03-30';
$startDate = '2020-03-01';
$query_indonesia_timeline = "SELECT 
                            r.date,
                            SUM(r.confirmed) as confirmed,
                            SUM(r.recovered) as recovered,
                            SUM(r.deaths) as deaths,
                            SUM(r.confirmed_diff) as confirmed_diff,
                            SUM(r.recovered_diff) as recovered_diff,
                            SUM(r.deaths_diff) as deaths_diff
                          FROM reports r
                          JOIN reports_region rr ON r.reports_id = rr.reports_id
                          WHERE rr.iso = 'IDN' AND r.date BETWEEN '$startDate' AND '$endDate'
                          GROUP BY r.date ORDER BY r.date";
$result_indonesia_timeline = $conn->query($query_indonesia_timeline);
$indonesiaTimeline = [];
while ($row = $result_indonesia_timeline->fetch_assoc()) {
    $indonesiaTimeline[] = $row;
}

// Timeline Global (30 hari terakhir)
$query_global_timeline = "SELECT 
                        r.date,
                        SUM(r.confirmed) as confirmed,
                        SUM(r.recovered) as recovered,
                        SUM(r.deaths) as deaths,
                        SUM(r.confirmed_diff) as confirmed_diff,
                        SUM(r.recovered_diff) as recovered_diff,
                        SUM(r.deaths_diff) as deaths_diff
                      FROM reports r
                      WHERE r.date BETWEEN '$startDate' AND '$endDate'
                      GROUP BY r.date ORDER BY r.date";
$result_global_timeline = $conn->query($query_global_timeline);
$globalTimeline = [];
while ($row = $result_global_timeline->fetch_assoc()) {
    $globalTimeline[] = $row;
}

// Hitung persentase potensi kasus positif
$indonesiaPositivePotential = ($indonesiaData['total_confirmed'] / 1000000) * 100;
$globalPositivePotential = ($globalData['total_confirmed'] / 29000000) * 100;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>COVID-19 Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .card {
            margin-bottom: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .card-header {
            font-weight: bold;
            background-color: #f8f9fa;
        }
        .confirmed {
            border-left: 5px solid #fd7e14;
        }
        .recovered {
            border-left: 5px solid #28a745;
        }
        .deaths {
            border-left: 5px solid #dc3545;
        }
        .fatality-rate {
            border-left: 5px solid #6c757d;
        }
        .positive-potential {
            border-left: 5px solid #17a2b8;
        }
        .stat-value {
            font-size: 24px;
            font-weight: bold;
        }
        .stat-diff {
            font-size: 14px;
        }
        .positive {
            color: #28a745;
        }
        .negative {
            color: #dc3545;
        }
    </style>
</head>
<body>
    <div class="container-fluid mt-4">
        <h1 class="text-center mb-4">COVID-19 Dashboard</h1>
        
        <!-- Indonesia Summary -->
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        Indonesia (IDN) - <?php echo date('d F Y'); ?>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="card confirmed">
                                    <div class="card-body">
                                        <h5 class="card-title">Terkonfirmasi</h5>
                                        <div class="stat-value"><?php echo number_format($indonesiaData['total_confirmed']); ?></div>
                                        <div class="stat-diff <?php echo $indonesiaData['today_confirmed'] > 0 ? 'negative' : 'positive'; ?>">
                                            <?php echo $indonesiaData['today_confirmed'] > 0 ? '+' : ''; ?>
                                            <?php echo number_format($indonesiaData['today_confirmed']); ?> hari ini
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card recovered">
                                    <div class="card-body">
                                        <h5 class="card-title">Sembuh</h5>
                                        <div class="stat-value"><?php echo number_format($indonesiaData['total_recovered']); ?></div>
                                        <div class="stat-diff positive">
                                            <?php echo $indonesiaData['today_recovered'] > 0 ? '+' : ''; ?>
                                            <?php echo number_format($indonesiaData['today_recovered']); ?> hari ini
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card deaths">
                                    <div class="card-body">
                                        <h5 class="card-title">Meninggal</h5>
                                        <div class="stat-value"><?php echo number_format($indonesiaData['total_deaths']); ?></div>
                                        <div class="stat-diff negative">
                                            <?php echo $indonesiaData['today_deaths'] > 0 ? '+' : ''; ?>
                                            <?php echo number_format($indonesiaData['today_deaths']); ?> hari ini
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card fatality-rate">
                                    <div class="card-body">
                                        <h5 class="card-title">Tingkat Kematian</h5>
                                        <div class="stat-value"><?php echo number_format($indonesiaData['fatality_rate'] * 100, 2); ?>%</div>
                                        <div class="stat-diff">
                                            Dari total kasus
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-4">
                                <div class="card positive-potential">
                                    <div class="card-body">
                                        <h5 class="card-title">Potensi Positif</h5>
                                        <div class="stat-value"><?php echo number_format($indonesiaPositivePotential, 2); ?>%</div>
                                        <div class="stat-diff">
                                            Dari total tes (asumsi 1 juta tes)
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Perkembangan 30 Hari Terakhir</h5>
                                        <canvas id="indonesiaTimelineChart"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Global Summary -->
        <div class="row mt-4">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        Global - <?php echo date('d F Y'); ?>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="card confirmed">
                                    <div class="card-body">
                                        <h5 class="card-title">Terkonfirmasi</h5>
                                        <div class="stat-value"><?php echo number_format($globalData['total_confirmed']); ?></div>
                                        <div class="stat-diff <?php echo $globalData['today_confirmed'] > 0 ? 'negative' : 'positive'; ?>">
                                            <?php echo $globalData['today_confirmed'] > 0 ? '+' : ''; ?>
                                            <?php echo number_format($globalData['today_confirmed']); ?> hari ini
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card recovered">
                                    <div class="card-body">
                                        <h5 class="card-title">Sembuh</h5>
                                        <div class="stat-value"><?php echo number_format($globalData['total_recovered']); ?></div>
                                        <div class="stat-diff positive">
                                            <?php echo $globalData['today_recovered'] > 0 ? '+' : ''; ?>
                                            <?php echo number_format($globalData['today_recovered']); ?> hari ini
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card deaths">
                                    <div class="card-body">
                                        <h5 class="card-title">Meninggal</h5>
                                        <div class="stat-value"><?php echo number_format($globalData['total_deaths']); ?></div>
                                        <div class="stat-diff negative">
                                            <?php echo $globalData['today_deaths'] > 0 ? '+' : ''; ?>
                                            <?php echo number_format($globalData['today_deaths']); ?> hari ini
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card fatality-rate">
                                    <div class="card-body">
                                        <h5 class="card-title">Tingkat Kematian</h5>
                                        <div class="stat-value"><?php echo number_format($globalData['fatality_rate'] * 100, 2); ?>%</div>
                                        <div class="stat-diff">
                                            Dari total kasus
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-4">
                                <div class="card positive-potential">
                                    <div class="card-body">
                                        <h5 class="card-title">Potensi Positif</h5>
                                        <div class="stat-value"><?php echo number_format($globalPositivePotential, 2); ?>%</div>
                                        <div class="stat-diff">
                                            Dari total tes (asumsi 29 juta tes)
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Perkembangan 30 Hari Terakhir</h5>
                                        <canvas id="globalTimelineChart"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Chart untuk Indonesia
        const indonesiaCtx = document.getElementById('indonesiaTimelineChart').getContext('2d');
        const indonesiaTimelineChart = new Chart(indonesiaCtx, {
            type: 'line',
            data: {
                labels: <?php echo json_encode(array_column($indonesiaTimeline, 'date')); ?>,
                datasets: [
                    {
                        label: 'Terkonfirmasi',
                        data: <?php echo json_encode(array_column($indonesiaTimeline, 'confirmed')); ?>,
                        borderColor: '#fd7e14',
                        backgroundColor: 'rgba(253, 126, 20, 0.1)',
                        tension: 0.1,
                        fill: true
                    },
                    {
                        label: 'Sembuh',
                        data: <?php echo json_encode(array_column($indonesiaTimeline, 'recovered')); ?>,
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.1,
                        fill: true
                    },
                    {
                        label: 'Meninggal',
                        data: <?php echo json_encode(array_column($indonesiaTimeline, 'deaths')); ?>,
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        tension: 0.1,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Chart untuk Global
        const globalCtx = document.getElementById('globalTimelineChart').getContext('2d');
        const globalTimelineChart = new Chart(globalCtx, {
            type: 'line',
            data: {
                labels: <?php echo json_encode(array_column($globalTimeline, 'date')); ?>,
                datasets: [
                    {
                        label: 'Terkonfirmasi',
                        data: <?php echo json_encode(array_column($globalTimeline, 'confirmed')); ?>,
                        borderColor: '#fd7e14',
                        backgroundColor: 'rgba(253, 126, 20, 0.1)',
                        tension: 0.1,
                        fill: true
                    },
                    {
                        label: 'Sembuh',
                        data: <?php echo json_encode(array_column($globalTimeline, 'recovered')); ?>,
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.1,
                        fill: true
                    },
                    {
                        label: 'Meninggal',
                        data: <?php echo json_encode(array_column($globalTimeline, 'deaths')); ?>,
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        tension: 0.1,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    </script>
</body>
</html>